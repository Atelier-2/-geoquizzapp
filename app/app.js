import Vue from "nativescript-vue";

import Home from "./components/Home";
import ModalInfo from "./components/ModalInfo";

new Vue({

    template: `
        <Frame>
            <Home />
        </Frame>`,

    components: {
        Home,
        ModalInfo
    }
}).$start();
