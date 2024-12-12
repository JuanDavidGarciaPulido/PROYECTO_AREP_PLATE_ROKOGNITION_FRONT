import AWS from 'aws-sdk';

function uploadImageToS3(file, setTextResponse, setFormData, setUrlImg, setCarPlate) {

  const bucketName = 'awscarplaterecokgnition';
  const region = 'us-east-1'; 

  const s3 = new AWS.S3({
    region: region,
    credentials: {
      accessKeyId: 'ASIATLNAOGXZHNM35UU7',
      secretAccessKey: 'jNVFTSUPgTgsv14gdnZRr7teX0zdzg1lH0emnuTM',
      sessionToken: 'IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJIMEYCIQCa5/KYQH9iGoTNyVhFSj9tyszryMX2es/Ew4LE06tCewIhAJHBQJ0NzUxTcvdkJS+d0d0VetcJEbZ9qCaHqdn8OZ5vKrsCCMD//////////wEQABoMMjMwNjU0MDk2ODgyIgwd23pL+YGbMoy7emgqjwLzjhg83QBHxCWJO3RrQKWYHeM2OglaO+tHNwzfVblZf2COXTQLt2yXA1+mGAzkcIoE5VrlHnecu4zxTdtizResL2tE+aca1TtknplH33iWPK8RVnv7Fec5j8jDAMTh5ba3jXnnRJHppHVeQlavptrYs+HDPst+Ug36MgrXHnPKN+khHuUl3TXbX5NDD8ggx2pvSF69lBZW0FabXByEbLPlYZP73hdmJxCI2V/007kXLn6LMT2IDtuMD0CjG0OJeOyqxRosx+CadEk4QYWh80Kl6pLblE1h7UvO3AvGYD66ihm+76mzszQvE8QrfpfVPpc56XbyL9+uBXLoUtltJiyG7K+wYfxFCxomuTV+U7fgMIzq67oGOpwBHSUSTw24XeR1lwfbeczPMB0IujzL++LyYcp6WkIMcFpwFTupcZrpOEaUXTqzT3VckJE5+opYTf6KEBUxyoCcl+1Itn71ZMnZWU8N/atgsxl30kqONb1aKdAP1G6PnvtKCggymO38iR9czhZOfkfAvPqOemlnauXksZCXQJKYTDEdgU/gu13V8/OHppkiXA7O02RfpSh6Z6WmrQOT'
    }
  });

  const params = {
    Bucket: bucketName,
    Key: file.name,
    Body: file,
    ACL: 'public-read'
  };

  s3.upload(params, (error, data) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Imagen subida exitosamente:', data.Location);
      //Fetch
      const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: params.Key
      };
      fetch("http://3.87.155.179:8080/check", options)
      .then(response => response.json())
      .then(result => {
          console.log('Solicitud exitosa:', result);
          if (result) {
            setTextResponse(`La imagen proporsionada tiene placas de automovil: ${result[0].plate}`);
            setCarPlate(result[0].plate)
            setFormData(true);
            setUrlImg(result[0].imageUrl);
          } else {
            setTextResponse("La imagen proporsionada no tiene placas de automovil");
          }
      })
      .catch(error => {
          console.error('Error en la solicitud:', error);
      });
      //
      return data.Location
    }
  });
}

export default uploadImageToS3;