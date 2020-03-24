<template>
    <Page>
        <ActionBar>
            <Label text="GeoQuizz"></Label>
        </ActionBar>

        <GridLayout>
            <Label class="info" textWrap="true"  @tap="takePicture">
                <FormattedString>
                    <Span class="fas" text.decode="             &#xf030; &#xa;&#xa;"/>
                    <Span :text="message"/>
                </FormattedString>
            </Label>
        </GridLayout>
    </Page>
</template>

<script>
import * as camera from "nativescript-camera";
import * as imagepicker from "nativescript-imagepicker";

import { Image } from "tns-core-modules/ui/image";
import { isAndroid, isIOS, device, screen } from "tns-core-modules/platform";

const fileSystemModule = require("tns-core-modules/file-system");
const bghttp = require("nativescript-background-http");
const session = bghttp.session("image-upload");
const { alert, confirm, prompt, login, action, inputType } = require("tns-core-modules/ui/dialogs");
                
    export default {
        computed: {
            message() {
                return "Prendre une photo";
            }
        },
        data(){
            return {
                 images: [],
                 is_sending: false,
                 totalBytes: 0,
                 currentProgress: 0,
                 currentBytes: 0
            }
        },
        methods: {
             takePicture() {           
                      camera.requestPermissions()
                        .then(() => {

                        camera.takePicture({
                            width: 300,
                            height: 300,
                            keepAspectRatio: true,
                            saveToGallery: true
                            })
                            .then( imageAsset => {

                            //API ImgBB
                            const api_key = "4395f03bb6df4554e8bf40506089c68f";

                            //Verification of Key
                            if (api_key === "") {
                                this.is_sending = false;
                                alert("Please set your ImgBB API key");
                                return;
                            }else{
                                console.log("Token API: OK")
                            }

                            //Image
                            let img = new Image();
                            img.src = imageAsset;

                            const url = "https://api.imgbb.com/1/upload";
                            const file_size_limit = 32000000; //32MB = 32 000 000 bytes
                            
                            let file_path = "";

                            if (isAndroid) file_path = img.src._android;
                            else if (isIOS) file_path = img.src._ios;

                            if (file_path === "" || file_path === undefined) {
                                this.is_sending = false;
                                alert("Can't find file");
                                return;
                            }

                            const file_name = file_path.substr(file_path.lastIndexOf("/") + 1);

                            const exists = fileSystemModule.File.exists(file_path);

                            if (!exists) {
                                this.is_sending = false;
                                alert("File does not exist");
                                return;
                            }

                            const file = fileSystemModule.File.fromPath(file_path);
                            const file_size = file.size; //Gets the size in bytes of the file.

                            if (file_size >= file_size_limit) {
                                this.is_sending = false;
                                alert("File size must be less than " + file_size_limit + "MB");
                                return;
                            }

                            this.is_sending = true;

                            const request = {
                                url: url + "?key=" + api_key,
                                method: "POST",
                                headers: {
                                "Content-Type": "application/octet-stream"
                                },
                                description: "Uploading " + file_name
                            };

                            const params = [
                                { name: "image", filename: file_path, mimeType: "image/jpeg" }
                            ];

                            const task = session.multipartUpload(params, request);

                            task.on("progress", this.progressHandler);
                            task.on("error", this.errorHandler);
                            task.on("responded", this.respondedHandler);
                            task.on("complete", this.completeHandler);
                            task.on("cancelled", this.cancelledHandler); // Android only

                            //Guardar imagen en arreglo
                            this.images.push(img);
                            //Alert
                                alert({
                                    title: "Félicitations",
                                    message: "La photo a été enregistré correctement.",
                                    okButtonText: "Accepter 😊"
                                }).then(() => {
                                    console.log("The user closed the alert.");
                                });

                            })
                        })       

            //End Take Picture
            },
            
            progressHandler(e) {
            this.totalBytes = Number(e.totalBytes);
            this.currentBytes = Number(e.currentBytes);

            if (this.currentBytes && this.totalBytes) {
                this.currentProgress = (this.currentBytes / this.totalBytes) * 100;
            }
            },
            errorHandler(e) {
            this.is_sending = false;
            console.log("received " + e.responseCode + " code.");
            alert(
                `An Error has occured  (Error code : "${e.responseCode}"). Image has not been uploaded !`
            );
            },
            respondedHandler(e) {
            this.is_sending = false;
            const result = JSON.parse(e.data);

            const uploaded_image = result.data;

            console.log(uploaded_image.url); //URL to save

            alert({
                title: "Success",
                message: `Image has been uploaded ! Here is it's url : ${uploaded_image.url}`,
                okButtonText: "OK"
            });
            },
            completeHandler(e) {
            this.is_sending = false;
            const serverResponse = e.response;
            },
            cancelledHandler(e) {
            this.is_sending = false;
            alert("upload cancelled");
            }

        //End methods
        }
    };
</script>

<style scoped lang="scss">
    @import '~@nativescript/theme/scss/variables/blue';

    // Custom styles
    .fas {
        color: white;
    }
    ActionBar {
        background-color: #fdbb2d;
    }

    .info {
        font-size: 25;
        horizontal-align: center;
        vertical-align: center;
        color: white;
        
    }

    GridLayout {
        background: rgb(34,193,195);
        background: linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%);
    }
</style>
