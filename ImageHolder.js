var ImageHolder = class {
    constructor(url) {
        
        this.url = url;
        this.image = new Image();
        this.image.src = this.url;

        this.placeholderImage = new Image();

        this.loaded = false;
        this.errored = false;

        this.image.onload = function () {
            this.loaded = true;
        }.bind(this);

        this.image.onerror = function () {
            this.errored = true;
        }.bind(this);

    }

    getImage() {
        if(this.errored || !this.loaded){
            return this.placeholderImage;
        }
        return this.image;
    }

}