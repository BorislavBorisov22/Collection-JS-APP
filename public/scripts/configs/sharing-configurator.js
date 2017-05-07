class ShareConfigurator {
    configurateFacebook() {
        (function(d, s, id) {
            let js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }

            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en0_US/sdk.js#xfbml=1&version=v2.9";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
}

const shareConfigurator = new ShareConfigurator();

export { shareConfigurator };