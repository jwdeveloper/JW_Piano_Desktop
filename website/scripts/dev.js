




function sendFile()
{
   return fetch("https://api.products.aspose.app/audio/cutter/api/cutter", {
        "headers": {
          "accept": "*/*",
          "accept-language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
          "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryiPHBnaEzKZR1Z42p",
          "sec-ch-ua": "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site"
        },
        "referrer": "https://products.aspose.app/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "------WebKitFormBoundaryiPHBnaEzKZR1Z42p\r\nContent-Disposition: form-data; name=\"1\"; filename=\"6.ogg\"\r\nContent-Type: audio/ogg\r\n\r\n\r\n------WebKitFormBoundaryiPHBnaEzKZR1Z42p\r\nContent-Disposition: form-data; name=\"convertOption\"\r\n\r\n{\"startTime\":\"00:00:00\",\"endTime\":\"00:00:10\",\"audioFormat\":\"ogg\"}\r\n------WebKitFormBoundaryiPHBnaEzKZR1Z42p--\r\n",
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
      })
      .then((response) => {
        if(response.ok) {
            return response.json();
        } else {
            throw new Error('Server response wasn\'t OK');
        }
      })
      .then((json) => {
        console.log(json)
        return json.Data.FileRequestId;
      });
}


function handleStatus(id)
{
    return  fetch("https://api.products.aspose.app/audio/cutter/api/cutter/HandleStatus?fileRequestId="+id, {
  "headers": {
    "accept": "application/json, text/javascript, */*; q=0.01",
    "accept-language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua": "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site"
  },
  "referrer": "https://products.aspose.app/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "omit"
})
.then((response) => {
    if(response.ok) {
        return response.json();
    } else {
        throw new Error('status not ok response wasn\'t OK');
    }
  })
  .then((json) => {
    console.log(json)

     if(json.Data.DownloadLink == null)
     {
      //  return  setTimeout(handleStatus(id), 5000)
     }

    return json;
  });
}


sendFile()
.then(id => { console.log("getting statis ",id)
 return handleStatus(id)
})
.then(id => console.log("getting link ",id))
