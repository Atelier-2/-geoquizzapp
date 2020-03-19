<template>
    <Page>
        <ActionBar>
            <Label text="GeoQuizz"></Label>
        </ActionBar>

        <GridLayout>
            <Label class="info" textWrap="true">
                <FormattedString>
                    <Span class="fas" text.decode="            &#xf030; &#xa;"/>
                    <Span :text="message"/>
                </FormattedString>
            </Label>
        </GridLayout>
    </Page>
</template>

<script>
    export default {
        computed: {
            message() {
                return "Prendre a photo";
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
        font-weight: bold;
    }

    GridLayout {
        background: rgb(34,193,195);
        background: linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%);
    }
</style>
