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
import { Image } from "tns-core-modules/ui/image";
//Modal
import ModalInfo from "./ModalInfo";
                
    export default {
        computed: {
            message() {
                return "Prendre une photo";
            }
        },

        methods: {
             takePicture() {                 
                 console.log("taped")
                //Permissions
                const camera = require("nativescript-camera"); // Requiring the plugin module
                // Or import only a specific class/method/property  of the plugin
                const requestPermissions = require("nativescript-camera").requestPermissions; // Requiring the needed code
                requestPermissions();

                //Var camera
                var imageModule = require("tns-core-modules/ui/image");
                //Options d'image
                var options = { width: 300, height: 300, keepAspectRatio: false, saveToGallery: true };
                
                camera.takePicture(options)
                .then(function (imageAsset) {
                    this.$showModal(ModalInfo);
                    console.log("Result is an image asset instance");
                    var image = new imageModule.Image();
                    image.src = imageAsset;
                }).catch(function (err) {
                    console.log("Error -> " + err.message);
                });
                
                //console.log("take a pic");
             }
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
