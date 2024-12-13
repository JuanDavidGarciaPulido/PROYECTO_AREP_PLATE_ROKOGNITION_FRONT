import AWS from 'aws-sdk';

function uploadImageToS3(file, setTextResponse, setFormData, setUrlImg, setCarPlate) {

  const bucketName = 'awscarplaterecokgnition';
  const region = 'us-east-1'; 

  const s3 = new AWS.S3({
    region: region,
    credentials: {
      accessKeyId: 'ASIATLNAOGXZP6KBEFRN',
      secretAccessKey: 'wS/Kap6/ZfCCl7VNrPo1zEnuflbsnpV38IyNJL8g',
      sessionToken: 'IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCIQCdsHoaMF5hFO40u2VkCnvxio1wb7S2vQmUYwUitClFIgIgMRPCkyDSqUfkskNJf7NUqdA+nuo68/JkCJbV4l4FNY4quwIIy///////////ARAAGgwyMzA2NTQwOTY4ODIiDAcaFOrwbKogLt/8byqPAvJvS0W3WYI1c1HQa7WyTpfukFSqhzwuCbdqwasCrH1wGJOqkq5B8Q8z05ps7WGh+TIfhVIS+nsDFzOyIng+vv62EoGYMjMZzxA2Xp5iCmJSAhG6xnPyoEQrxxIRr23ssJMCoPbo+tKOpbV3QFv36qjF5yyZDwt39X74kQMobMUDELVmaFlxeWMTrfBan99fVRir4qXaYJQdB14xP1H5kl9qmHf0aUkaSe+wbbsjqxtjOwSjkORETlR65JOV8Sq2kXiCUFt1CwegPtSws1TQCZid3fMZBAlvZAUsPKiJH2DFq+6W2jaTh+mtd6C8F+TGlSMCAyq1Mz8HjqEzLQMEkAs33/J4QCDnC6wSi38pvLswuKDuugY6nQGQ5e41Rbfz7xQHcPWJziexCVbAZwgxtdQkrSEL0KVjIfGSka8GjaJPUbdqEG86SuWAN4iWzXDlHTh6pQjVkIEslZjIz0SA796FQHN+UGXosRSjcZACEwxQSS5TaPT70ZS7lhSDoyDzv+n+c3MCPsRtIXV5Bct46Xnt48PJBdZ3sQmPXFRjQcT8Kz8QPMTfiovvtgjrWu61MDFFxyYI'
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
      fetch("http://34.229.218.177:8080/check", options)
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