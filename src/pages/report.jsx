import { Modal } from '../components/modal/modal';
import './style/report.css';
import React from 'react';
import uploadImageToS3 from './uploadImageToS3';
import { useNavigate } from 'react-router-dom';

function Report() {

    const navigate = useNavigate();
    const [openModal, setOpenModal] = React.useState(false);
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [textResponse, setTextResponse] = React.useState('');
    const [dataCars, setDataCars] = React.useState([]);
    const [searchPlate, setSearchPlate] = React.useState('');

    //Car Data
    const [plate, setCarPlate] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [formData, setFormData] = React.useState(false);
    const [imageUrl, setUrlImg] = React.useState(null);

    React.useEffect(() => {
        fetchDatabase();
    }, [])

    function fetchDatabase() {
        fetch("http://34.229.218.177:8080/cars")
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setDataCars(data);
            })
    }

    function handleClick() {
        setOpenModal(true);
    }

    const handleImageUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            uploadImageToS3(file, setTextResponse, setFormData, setUrlImg, setCarPlate)
        }
    };

    const handleClickCancel = () => {
        setOpenModal(false);
        resetValues();
    }

    const resetValues = () => {
        setSelectedImage(null);
        setTextResponse('');
        setFormData(false);
        setCarPlate('');
        setDescription('');
        setUrlImg(null);
    }

    const handleClickReport = () => {
        const data = {
            "imageUrl": imageUrl,
            "plate": plate,
            "description": description
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        fetch("http://34.229.218.177:8080/cars", options)
            .then(result => {
                console.log('Solicitud exitosa:', result);
                setOpenModal(false);
                resetValues();
                fetchDatabase();
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
            });
    }

    const handleDescriptionChange = (event) => {
        const value = event.target.value;
        setDescription(value);
    }

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchPlate(value);
    }

    const filteredData = dataCars.filter(car => car.plate.toLowerCase().includes(searchPlate.toLowerCase()));

   

    const isValid = imageUrl != null;

    return (
        <div className="container_report">

            <header className='header_report'>
                <h1 className='title'>TrackPlate</h1>
            </header>

            <main className='main_reports'>
                <input
                    type="text"
                    placeholder="Buscar por placa..."
                    value={searchPlate}
                    onChange={handleSearchChange}
                    className="search-input"
                />

                {filteredData.map((data, index) => {
                    const bucketName = 'awscarplaterecokgnition';
                    const region = 'us-east-1'
                    const imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${data.imageUrl}`

                    return (
                        <div className="card" key={index}>
                            <div className="card-image">
                                <img src={imageUrl} alt={`Imagen de ${data.plate}`} />
                            </div>
                            <div className="card-details">
                                <h2>Placa: {data.plate}</h2>
                                <p>Descripción: {data.description}</p>
                            </div>
                        </div>
                    )
                })}


            </main>

            <button onClick={() => handleClick()} className="bottom-right">Reportar</button>

            {!!openModal && (
                <Modal>
                    <div className="contenedor_image">
                        <h1>Analiza una Imagen</h1>

                        {!selectedImage && <p>Sube una imagen</p>}
                        {!selectedImage && <input type="file" onChange={handleImageUpload} />}
                        {selectedImage && <img src={selectedImage} />}
                        {selectedImage && <h2>{textResponse}</h2>}

                        {formData && <p>danos más información para encontrar el auto!</p>}

                        {formData &&
                            (<div className='data_animal'>
                                <input type="text" placeholder='Digita la descripción' value={description} onChange={handleDescriptionChange} />
                            </div>)
                        }

                        <div className='buttons'>
                            <button disabled={!isValid} className='report' onClick={() => handleClickReport()}>Reportar</button>
                            <button className='cancel' onClick={() => handleClickCancel()}>Cancelar</button>
                        </div>
                    </div>
                </Modal>
            )}

        </div>
    )
}

export default Report;
