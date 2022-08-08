

const formulario = document.querySelector('#formulario');
const divChatBot = document.querySelector('#divChatbox');
const textArea = document.querySelector('#textArea');
const boton = document.querySelector('#btn-send');
const botonMicro = document.querySelector('#btnMicro');
let id = '';

const svgOff = `
  
<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-microphone-off" width="32" height="32" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <line x1="3" y1="3" x2="21" y2="21" />
  <path d="M9 5a3 3 0 0 1 6 0v5a3 3 0 0 1 -.13 .874m-2 2a3 3 0 0 1 -3.87 -2.872v-1" />
  <path d="M5 10a7 7 0 0 0 10.846 5.85m2.002 -2a6.967 6.967 0 0 0 1.152 -3.85" />
  <line x1="8" y1="21" x2="16" y2="21" />
  <line x1="12" y1="17" x2="12" y2="21" />
</svg>

`

const svg = `
 
<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-microphone" width="32" height="32" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
<rect x="9" y="2" width="6" height="11" rx="3" />
<path d="M5 10a7 7 0 0 0 14 0" />
<line x1="8" y1="21" x2="16" y2="21" />
<line x1="12" y1="17" x2="12" y2="21" />
</svg>

`

textArea.addEventListener('input' , () => {
     
    if(textArea.value.length > 0){
        boton.disabled = false;
        botonMicro.disabled = true;
    }else{
        boton.disabled = true;
        botonMicro.disabled = false;
    }

})




window.addEventListener('DOMContentLoaded' , () => {
       
        console.log("Hola mundo")

        botonMicro.innerHTML = '';
        botonMicro.innerHTML = svgOff;
       
        localStorage.clear();
        id = Math.random().toString(36).substring(2, 9) + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('identificador' , id);
        boton.disabled = true;

        textArea.focus();

})

const answerResult = async(text) => {

   const texto = {
     
      mensaje: text,
      identi: localStorage.getItem('identificador') || id

   }

   console.log(JSON.stringify(texto));

    const result = await fetch('/chatbot/api/dialogflow' , {method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(texto)
    });

    const data = await result.json();
    const {message} = data;
    
    return message;
 
 }
 

formulario.addEventListener('submit' , (e) => {
   
    e.preventDefault();

    const message = textArea.value;
    captureMessage(message , 2);
    
    const respuesta = answerResult(message);
   
    respuesta.then(result => {
          
      setTimeout(() => {
          
        captureMessage(result , 1);
        callAPiTextToSpeech(result);

        if(result === 'Lo siento pero ya fuiste evaluado el dia de hoy y para llevar el progreso del test de forma correcta solo se puede evaluar una vez al dia' || result === 'Lo siento pero no eres alumno o profesor de la usmp, asi que no puedo evaluarte' || result.includes('hasta luego')){
           
            formulario.innerHTML = '';
            formulario.innerHTML = `
              
              <div class="alert alert-danger" role="alert"> 
                
                   <p>La conversacion a terminado, si quieres volver a conversar con el bot recarga la pagina por favor</p>
              
              </div>

            `
        }

      }, 10);
        
    });
            

})


const captureMessage = (mensaje , flag) => {
   
   insertMessage(mensaje , flag);
   botonMicro.disabled = false;
   limpiarCampo();

}

const insertMessage = (message , numero) => {

    const liMensaje = document.createElement('li');
    const divPrincipal = document.createElement('div');
    const userMensaje = document.createElement('h5');
    const divMensaje = document.createElement('div');
    const divHora = document.createElement('div');
    const divImg = document.createElement('div');
    const img = document.createElement('img');
    const dia = new Date();
    const hora = dia.getHours() + ':' + dia.getMinutes();

    if(numero === 1){
   
        liMensaje.classList.add('reverse')
        divMensaje.classList.add('box' , 'bg-light-inverse');
        userMensaje.textContent = 'Bot Usmp';
        img.src = '/assets/images/users/Logo-GOOGLE.jpeg';
        img.alt = 'Bot';

    }else {
      
        divMensaje.classList.add('box' , 'bg-light-info');
        userMensaje.textContent = 'Julio Aguero';
        img.src = '/assets/images/users/julio.jpg';
        img.alt = 'user';

    }
     
    divImg.classList.add('chat-img');
    divPrincipal.classList.add('chat-content');
    divMensaje.textContent = message;
    divHora.classList.add('chat-time');
    divHora.textContent = hora;

    
    divImg.appendChild(img);
    divPrincipal.appendChild(divImg);
    divPrincipal.appendChild(userMensaje);
    divPrincipal.appendChild(divMensaje);

    liMensaje.appendChild(divPrincipal);
    liMensaje.appendChild(divHora);

    
    divChatBot.appendChild(liMensaje);
    scroll();

}

const callAPiTextToSpeech = async(resultado) => {
  
      const audio = {
   
          voice : resultado

      }

      console.log(JSON.stringify(audio));

      const result = await fetch('/chatbot/api/text-to-speech' , {method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(audio)
      });
  
      const data = await result.json();
      const {audioBs} = data;

      reproducirAudio(audioBs);
}

const reproducirAudio = (audioMessage) => {
    const audio = document.getElementById('audio');
    audio.src = `data:audio/mpeg;base64,${audioMessage}`;

    audio.addEventListener('ended' , () => {
        audio.src = '';
    })
}

const limpiarCampo = () => {
   
    textArea.value = '';
    textArea.focus();

}

const scroll = () => {
   
    divChatBot.scrollTop = divChatBot.scrollHeight;
 
};


navigator.mediaDevices.getUserMedia({ audio: true })
.then(function(mediaStreamObj){

    let mediaRecorder = new MediaRecorder(mediaStreamObj);
    let boto = document.querySelector('.btn-recorder');
    let dataArray = [];

  

    boto.addEventListener('touchstart' , (e) => {

        mediaRecorder.start();
          
        if(boto.classList.contains('btn-estilos')){
           boto.classList.remove('btn-estilos');  
       }

       boto.classList.add('btn-grabado');
    })

    boto.addEventListener('touchmove' , (e) => {
    })

    boto.addEventListener('touchcancel' , (e) => {
        console.log('TouchCancel');
    })

    boto.addEventListener('touchend' , () => {

        mediaRecorder.stop();
          
        if(boto.classList.contains('btn-grabado')){
            boto.classList.remove('btn-grabado');  
        }

        boto.classList.add('btn-estilos');

    })



    boto.addEventListener('mousedown' , () => {
        mediaRecorder.start();
        
        if(boto.classList.contains('btn-estilos')){
            boto.classList.remove('btn-estilos');  
        }

        boto.classList.add('btn-grabado');

        boto.innerHTML = '';
        boto.innerHTML = svg;
        boton.disabled = true;
        textArea.disabled = true;
      
    });
   
    boto.addEventListener('mouseup' , () => {
         
        mediaRecorder.stop();
        
        if(boto.classList.contains('btn-grabado')){
            boto.classList.remove('btn-grabado');  
        }

        boto.classList.add('btn-estilos');

        boto.innerHTML = '';
        boto.innerHTML = svgOff;
       
        
    });

    mediaRecorder.ondataavailable = function (ev) {
        dataArray.push(ev.data);
    } 


    mediaRecorder.onstop = async function (ev) {
  

         let audioData = new Blob(dataArray, { 'type': 'audio/mp3;' });
         const {size} = audioData;

         if(size > 3000){
         
         let audioUser = '';

         audioUser = await blobToBase64(audioData).then(result => {return result});
         callApiSpeechToText(audioUser);
         dataArray = [];
         boton.disabled = false;
         textArea.disabled = false;

         }else {

    
            dataArray = [];
            boton.disabled = false;
            textArea.disabled = false;
  
            const mensaje = 'No pude entender lo que me dijiste , por favor intenta de nuevo';
            captureMessage(mensaje , 1);
            callAPiTextToSpeech(mensaje);
         }

     }

     const blobToBase64 = async blob => {
         const reader = new FileReader();
         reader.readAsDataURL(blob);
         return new Promise(resolve => {
             reader.onloadend = () => {
             resolve(reader.result);
             };
         });
      };
    
});

const callApiSpeechToText = async (audio) => {
     
    audio = audio.substr(23);
   
    const voz = {
   
        audioVoz : audio

    }

    const result = await fetch('/chatbot/api/speech-to-text' , {method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(voz)
    });

    const data = await result.json();
    const {audioUser} = data;
    captureMessage(audioUser , 2);

    const respuesta = answerResult(audioUser);
   
    respuesta.then(result => {
          
      setTimeout(() => {
          
        captureMessage(result , 1);
        callAPiTextToSpeech(result);

        if(result === 'Lo siento pero ya fuiste evaluado el dia de hoy y para llevar el progreso del test de forma correcta solo se puede evaluar una vez al dia' || result === 'Lo siento pero no eres alumno o profesor de la usmp, asi que no puedo evaluarte' || result.includes('hasta luego')){
            formulario.innerHTML = '';
            formulario.innerHTML = `
              
              <div class="alert alert-danger" role="alert"> 
                
                   <p>La conversacion a terminado, si quieres volver a conversar con el bot recarga la pagina por favor</p>
              
              </div>

            `
        }

      }, 10);
        
    });

}
