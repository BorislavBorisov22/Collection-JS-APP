import { requester } from 'requester';
import { templateLoader } from 'template-loader';
import { utils } from 'utils';


const $appContainer = $('#container');

const homeController = {
    check(params) {
        const { category } = params;

        $appContainer.html(category);

        templateLoader.load('home')
            .then((template) => {
                $appContainer.html(template());      
            });

           let video= $( ".video" );
           $( document ).ready(function videoStarter(){
                let tag = document.createElement('script');

                tag.src = "https://www.youtube.com/player_api";
                let firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      
                let player;
                (function onYouTubePlayerAPIReady() {
                  console.log('here');
                  console.log(YT);
                  player = new YT.Player('ytplayer', {
                    videoId: 'U4qUfOMMCgc?autoplay=1&controls=0&showinfo=0&rel=0&start=116&end=153&loop=1'
                  });
                })();
           });
           
                
        //  (function facebookLike(doc, s, id) {
        //         var js, facebookJS = doc.getElementsByTagName(s)[0];
        //         if (doc.getElementById(id)) return;
        //         js = doc.createElement(s); js.id = id;
        //         js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.9";
        //         facebookJS.parentNode.insertBefore(js, facebookJS);
        //       }(document, 'script', 'facebook-jssdk')); 
            
          
            var team=document.getElementsByClassName("team");
            console.log(team);
            // $(".team").on("click", function(){
            // console.log("vliza li v event-a");
            // });
            team.addEventListener("click", function(){
            console.log("vliza li v event-a");
            
            // this.get('/#', (context) => {
            // context.redirect('#/marketplace');
            // });
            
     });
    }
};

export { homeController };
