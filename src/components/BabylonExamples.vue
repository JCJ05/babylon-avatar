<template>
    
    <div>
        <h3>WebGl Elaborado con la libreria front-end vueJs y el framework Babylon.Js</h3>
        <canvas></canvas>
        <br />
        <div id="eliminar">
         <button id="btnMicro" class="btn-recorder btn-estilos" type="button"></button>
         </div>
         <p class="formulario"></p>
         <br />
           <audio id="audio" style="visibility: hidden;" autoplay controls >
        The “audio” tag is not supported by your browser. Click [here] to download the sound file.
    </audio>

    </div>

</template>

<script lang="ts">

import { defineComponent } from 'vue';
import { ChatbotScene } from '../BabylonClass/ChatbotScene';


export default defineComponent({
  name: 'BabylonExamples',

  mounted(){
    const canvas = document.querySelector('canvas')!;
     new ChatbotScene(canvas);

  }

 
});

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


let id = '';

window.addEventListener('DOMContentLoaded' , () => {
        
        console.log('DOM cargado');

        const botonMicro = document.querySelector('#btnMicro') as HTMLButtonElement;

        botonMicro.innerHTML = '';
        botonMicro.innerHTML = svgOff;
       
        localStorage.clear();
        id = Math.random().toString(36).substring(2, 9) + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('identificador' , id);

})


const answerResult = async(text:any) => {
     
     const regex = "[0-9]";
     const index = text.search( regex );
     console.log(index);
     
     if(index != -1){
      
        const tamaño = text.length;
        const verificar = tamaño - index;
        console.log(tamaño);

        if(verificar >= 8) {

          const codigo = text.substring(index, index + 9);
          const regexWords = "[a-zA-Z]";
          const indexWords = codigo.search( regexWords );
            
            if(indexWords == -1){

                text = codigo.split(" ").join("");
                console.log(codigo.split(" ").join(""));

            }

         
        }

     }

   const texto = {
     
      mensaje: text,
      identi: localStorage.getItem('identificador')

   }

   console.log(JSON.stringify(texto));

    const result = await fetch('https://principal-arena-343420.uc.r.appspot.com/chatbot/api/dialogflow' , {method: 'POST',
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

const callAPiTextToSpeech = async(resultado:any) => {
  
      const audio = {
   
          voice : resultado

      }

      const result = await fetch('https://principal-arena-343420.uc.r.appspot.com/chatbot/api/text-to-speech' , {method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(audio)
      });
  
      const data = await result.json();
      const {audioBs} = data;

      reproducirAudio(audioBs , resultado);
}

const reproducirAudio = (audioMessage:any , result: any) => {
    const audio = document.getElementById('audio') as HTMLAudioElement;
    audio.src = `data:audio/mpeg;base64,${audioMessage}`;

    audio.addEventListener('loadedmetadata' , () => {
        var durarion = audio.duration;
        logicalAnimations(durarion , result);
    })
}

const logicalAnimations = (duarcion: number, result:any) => {
    
      if(result.includes("Hola") || result.includes("estas listo") || result.includes("Lo siento")){

        ChatbotScene.Idle(duarcion);

      }else if(result.includes("flexiones")){
         
        ChatbotScene.Planchas(duarcion);

      }else if (result.includes("abdominales")){
          
        ChatbotScene.Abdominales(duarcion);

      }else if(result.includes("rendimiento")){

          ChatbotScene.Final(duarcion);
      }
}
  
  navigator.mediaDevices.getUserMedia({ audio: true })
.then(function(mediaStreamObj){

    let mediaRecorder = new MediaRecorder(mediaStreamObj);
    let boto = document.querySelector('.btn-recorder')!;
    let dataArray:any = [];

  
  

    boto.addEventListener('touchstart' , (e) => {

        mediaRecorder.start();
          
        if(boto.classList.contains('btn-estilos')){
           boto.classList.remove('btn-estilos');  
       }

       boto.classList.add('btn-grabado');
    })

    boto.addEventListener('touchmove' , (e) => {
      console.log('movimiento')
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
         
         let audioUser:any = '';

         audioUser = await blobToBase64(audioData).then(result => {return result});
         callApiSpeechToText(audioUser);
         dataArray = [];
         console.log(audioUser);

         /* const texto = {
     
      mensaje: "HOLA MUNDO",
      identi: "123456789"

   }
       
       fetch('http://localhost:8082/api/dialogflow' , {method: 'POST',
    headers: {
      'Accept': '',
       'mode': 'no-cors',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(texto)
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
    })
    .catch(error => console.error('Error:', error));*/          
        
         }else {

    
            dataArray = [];
          
            const mensaje = 'No pude entender lo que me dijiste , por favor intenta de nuevo';
            console.log(mensaje);
            callAPiTextToSpeech(mensaje);
         }

     }

     const blobToBase64 = async (blob:any)  => {
         const reader = new FileReader();
         reader.readAsDataURL(blob);
         return new Promise(resolve => {
             reader.onloadend = () => {
             resolve(reader.result);
             };
         });
      };
    
});

const callApiSpeechToText = async (audio:any) => {
     
    audio = audio.substr(23);
   
    const voz = {
   
        audioVoz : audio

    }

    const result = await fetch('https://principal-arena-343420.uc.r.appspot.com/chatbot/api/speech-to-text' , {method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(voz)
    });

    const data = await result.json();
    const {audioUser} = data;


    const respuesta = answerResult(audioUser);
    console.log(respuesta);
   
    respuesta.then(result => {
          
      setTimeout(() => {
          
        callAPiTextToSpeech(result);
         if(result === 'Lo siento pero ya fuiste evaluado el dia de hoy y para llevar el progreso del test de forma correcta solo se puede evaluar una vez al dia' || result === 'Lo siento pero no eres alumno o profesor de la usmp, asi que no puedo evaluarte' || result.includes('hasta luego') || (result.includes("rendimiento"))){
            const botonMicro = document.querySelector('#eliminar') as HTMLButtonElement;
            const formulario = document.querySelector('.formulario') as HTMLFormElement;
            botonMicro.innerHTML = '';
            formulario.innerHTML = `
              
              <div class="alert alert-danger" role="alert"> 
                
                   <p>La conversacion a terminado, si quieres volver a conversar con el bot recarga la pagina por favor</p>
              
              </div>

            `
        }
       
      }, 10);
        
    });

}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
  canvas {
    width: 70%;
    height: 70%;
  }

  .btn-estilos {
    background-color: skyblue;
    border-radius: 30px;
    border-color: skyblue;
    padding: 5px;
    cursor: pointer;
}

.btn-grabado {
   background-color: red;
    border-radius: 30px;
    border-color: red;
    padding: 5px;
    cursor: pointer;
}

</style>
