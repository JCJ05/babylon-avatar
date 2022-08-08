import { AnimationGroup, CubeTexture, Engine, FreeCamera, HemisphericLight, Scene, SceneLoader, Vector3 } from "@babylonjs/core";
import "@babylonjs/loaders";


export class ChatbotScene {
  
    static scene: Scene;
    static engine: Engine;
    static idle: any;
    static talk: any;
    static abdominales: any;
    static planchas: any;
    static global: any;

    constructor(private canvas: HTMLCanvasElement){
       
        ChatbotScene.engine = new Engine(this.canvas, true);
        ChatbotScene.scene = this.CreateScene();
        this.CreateCharacter();

        ChatbotScene.engine.runRenderLoop(() => {
            ChatbotScene.scene.render();
        })

    }

    CreateScene(): Scene {
        const scene = new Scene(ChatbotScene.engine);
        const camera = new FreeCamera("camera" , new Vector3(0 , 1 , -5) , ChatbotScene.scene);
        camera.attachControl();
        camera.speed = 0.25;

        const light = new HemisphericLight("light", new Vector3(0, 1, 0), ChatbotScene.scene);
        light.intensity = 0.5;
        
        const envTex = CubeTexture.CreateFromPrefilteredData("environmet/environment.env", scene);
        scene.environmentTexture = envTex;
        scene.createDefaultSkybox(envTex , true);

        return scene;
    }

    async CreateCharacter(): Promise<void> {
        const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
          "",
          "./modelos/",
          "boy.glb"
        );
    
        meshes[0].rotate(Vector3.Up(), Math.PI);
    
        console.log("animation groups", animationGroups);
         
        ChatbotScene.abdominales = animationGroups[0];
        ChatbotScene.idle = animationGroups[1];
        ChatbotScene.planchas = animationGroups[2];
        ChatbotScene.talk = animationGroups[3];

        animationGroups[0].stop();
        animationGroups[1].play(true);

        
      }


      static Idle(duracion: number) {
          
        ChatbotScene.scene.onBeforeRenderObservable.runCoroutineAsync(ChatbotScene.animationBlending(this.talk, this.idle));
        ChatbotScene.global = this.talk;
   
        const tiempo = duracion * 1000;

        setTimeout(() => {
            ChatbotScene.scene.onBeforeRenderObservable.runCoroutineAsync(ChatbotScene.animationBlending(this.idle, this.talk));
        }, tiempo);

        this.global = this.idle;

      }

      static Planchas(duracion: number) {
         
        ChatbotScene.scene.onBeforeRenderObservable.runCoroutineAsync(ChatbotScene.animationBlending(this.talk, this.global));
        this.global = this.talk;

        const tiempo = duracion * 1000;

        setTimeout(() => {
            ChatbotScene.scene.onBeforeRenderObservable.runCoroutineAsync(ChatbotScene.animationBlending(this.planchas, this.talk));
        }, tiempo);

        this.global = this.planchas;
      }

      static Abdominales(duracion: number) {
          
        ChatbotScene.scene.onBeforeRenderObservable.runCoroutineAsync(ChatbotScene.animationBlending(this.talk, this.global));
        this.global = this.talk;

        setTimeout(() => {
            ChatbotScene.scene.onBeforeRenderObservable.runCoroutineAsync(ChatbotScene.animationBlending(this.abdominales, this.talk));
        }, duracion * 1000);

        this.global = this.abdominales;
      }

      static Final(duracion: number){
        
        console.log(this.global);
        ChatbotScene.scene.onBeforeRenderObservable.runCoroutineAsync(ChatbotScene.animationBlending(this.talk, this.global));
        this.global = this.talk;

        setTimeout(() => {
            ChatbotScene.scene.onBeforeRenderObservable.runCoroutineAsync(ChatbotScene.animationBlending(this.idle, this.talk));
        }, duracion * 1000);

        this.global = this.idle;
      }

      static *animationBlending(toAnim: AnimationGroup, fromAnim: AnimationGroup){
        let currentWeight = 1;
        let newWeight = 0;
        
        fromAnim.stop();
        toAnim.play(true);
  
       while(newWeight< 1){
         
            newWeight +=0.01;
            currentWeight -= 0.01;
            //toAnim.setWeightForAllAnimatables(newWeight);
            //fromAnim.setWeightForAllAnimatables(currentWeight);
            yield;
          
        }
  
  
    }
}