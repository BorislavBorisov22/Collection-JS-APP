import { requester } from 'requester';
import { templateLoader } from 'template-loader';


const $appContainer = $('#container');

const homeController={
   check(params) {
   const { category } = params;
  
     $appContainer.html(category);


     templateLoader.load('home')
            .then((template) => {
                $appContainer.html(template());
                console.log("works2");
            });
   }
}

export {homeController};