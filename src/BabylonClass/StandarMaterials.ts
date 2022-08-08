import { Engine, FreeCamera, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";


export class StandarMaterials {
  
    scene!: Scene;
    engine!: Engine;

    constructor(private canvas: HTMLCanvasElement){
       
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();

        this.engine.runRenderLoop(() => {
            this.scene.render();
        })

    }

    CreateScene(): Scene {
        const scene = new Scene(this.engine);
        const camera = new FreeCamera("camera" , new Vector3(0 , 1 , -5) , this.scene);
        camera.attachControl();
        camera.speed = 0.25;

        const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
        light.intensity = 1;
        
        const ground = MeshBuilder.CreateGround("ground", {width: 10, height: 10}, this.scene);
        const ball = MeshBuilder.CreateSphere("ball", {diameter: 1}, this.scene);
        ball.position = new Vector3(0, 1, 0);

        ground.material = this.CreateGroundMaterial();
        ball.material = this.CreateBallMaterial();

        return scene;
    }

    CreateGroundMaterial(): StandardMaterial {
       
        const groundMat = new StandardMaterial("groundMat", this.scene);
        const unScale = 4;
        const textArray: Texture[] = [];

        const diffuseText = new Texture("./textures/stone/yellow_diffuse_1k.jpg", this.scene);
        groundMat.diffuseTexture = diffuseText;
        textArray.push(diffuseText);

        const normalText = new Texture("./textures/stone/yellow_normal_1k.jpg", this.scene);
        groundMat.bumpTexture = normalText;
        textArray.push(normalText);

        const aoText = new Texture("./textures/stone/yellow_ao_1k.jpg", this.scene);
        groundMat.ambientTexture = aoText;
        textArray.push(aoText);

        const specularText = new Texture("./textures/stone/yellow_spec_1k.jpg", this.scene);
        groundMat.specularTexture = specularText;
        textArray.push(specularText);

        textArray.forEach(text => {
            text.uScale = unScale;
            text.vScale = unScale;
        })

        return groundMat;
    }

    CreateBallMaterial(): StandardMaterial {
              
        const ballMat = new StandardMaterial("ballMat", this.scene);
        const unScale = 3;
        const textArray: Texture[] = [];
    
        const diffuseText = new Texture("./textures/metal/metal_diffuse.jpg", this.scene);
        ballMat.diffuseTexture = diffuseText;
        textArray.push(diffuseText);

        const normalText = new Texture("./textures/metal/metal_plate.jpg", this.scene);
        ballMat.bumpTexture = normalText;
        ballMat.invertNormalMapX = true;

        textArray.push(normalText);

        const aoText = new Texture("./textures/metal/meta_ao.jpg", this.scene);
        ballMat.ambientTexture = aoText;
        textArray.push(aoText);

        const specularText = new Texture("./textures/metal/metal_spec.jpg", this.scene);
        ballMat.specularTexture = specularText;
        textArray.push(specularText);

        textArray.forEach(text => {
            text.uScale = unScale;
            text.vScale = unScale;
        })

        return ballMat;
    }

    static prueba() {
        console.log("Hola");
    }
}