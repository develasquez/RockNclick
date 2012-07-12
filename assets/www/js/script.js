var iA = 0; //imagenActual
var iT = 0; //Total de Imagenes
var iTPlayer = 0 ;
var iAPlayer=0;
var albumActual= 3;
var myWidth = 240;
var myHeiht = 400;
var verTodas = false;
var jsonPosts = {};
var jsonElPost = {};
var jsonGaleria= {};
var jsonGaleriaPlayer = {}
var jsonDescarga = {};
var galeriaSeleccionada = 0;
var mostroSplash = false;
var twitterUrl = "";
var faceUrl = "";
var networkState = "";
var nombreGaleria = "";
var imageList = {};


var iniciado = false;
buscaId = function(titulo){
    var theId = 0 ;
    I=0;
    $.each(jsonPosts,function(i,e){

        if(jsonPosts.posts[I].title == titulo)
        {
            theId = jsonPosts.posts[I].id;
        }
        I++;
    });
    return theId;
}
traePost = function (){
    
    setTimeout("init()",500);

    $.getJSON('http://rockandclick.cl?json=get_recent_posts',function(data){
        jsonPosts = data;
        nombreGaleria = jsonPosts.posts[0].slug
        traeGaleria(imageList[jsonPosts.posts[0].id])
        galeriaSeleccionada = jsonPosts.posts[0].id;
        url = jsonPosts.posts[0].url
        faceUrl = "http://www.facebook.com/sharer/sharer.php?u=" + url;
        text = jsonPosts.posts[0].title +  "| Rock and Click - Radio Futuro 88.9 "
        url = 'https://twitter.com/intent/tweet?text='+ text +'&url=' + url
        $("#div_text").html("<br><br>");
        $("#div_text").append(jsonPosts.posts[0].content);
        twitterUrl = url;
        $("#twitter_href").click(function(){
             document.location.href=twitterUrl;
        })
        $("#facebook_href").on("click",function(){
            document.location.href=faceUrl;
        })
    });
    
}

traeElPost = function (idPost){

   
     $.getJSON('http://rockandclick.cl?json=get_post&post_id=' + idPost,function(data){
        jsonElPosts = data;
        nombreGaleria = jsonElPosts.post.slug;
         url = jsonElPosts.post.url;
         faceUrl = "http://www.facebook.com/sharer/sharer.php?u=" + url;
        text = jsonElPosts.post.title +  "| Rock and Click - Radio Futuro 88.9 "
        url = 'https://twitter.com/intent/tweet?text='+ text +'&url=' + url
        $("#textoEvento").html("<br><br>");
        $("#textoEvento").append(jsonElPosts.post.content);
        
        twitterUrl = url;
        $("#twitter_href").click(function(){
             document.location.href=twitterUrl;
        })
        $("#facebook_href").on("click",function(){
            document.location.href=faceUrl;
        })
    });
}

compartir = function (){
    $.mobile.changePage("#share");
}

traeGaleria = function(idGaleria){
      $.mobile.showPageLoadingMsg();
    var params= {
        action:'get_galeryImages',
        gallery:idGaleria
    }
    $.get('http://rockandclick.cl/wp-admin/admin-ajax.php',params,function(data){
        jsonGaleria = JSON.parse(data);
        iT = jsonGaleria.gallery.length;
   
        $("#post_img_principal").attr("src",jsonGaleria.gallery[0].image)
        $(".post_img_carusel_rigth").attr("src",jsonGaleria.gallery[1].thumb)
        $(".post_img_carusel_center").attr("src",jsonGaleria.gallery[2].thumb)
        $(".post_img_carusel_left").attr("src",jsonGaleria.gallery[3].thumb)
        iA=3;
        cambiaImagen();
          $.mobile.hidePageLoadingMsg();
    });

}

traeGaleriaPlayer = function(idGaleria){
    var params= {
        action:'get_galeryImages',
        gallery:imageList[ idGaleria]
    }
    traeElPost(idGaleria);
    $.get('http://rockandclick.cl/wp-admin/admin-ajax.php',params,function(data){

        jsonGaleriaPlayer = JSON.parse(data);

        
        iTPlayer = jsonGaleriaPlayer.gallery.length;
   
        $("#post_img_principal2").attr("src",jsonGaleriaPlayer.gallery[0].image)

       botonera.cambiaImagen()
    });

}


traeGalerias = function(){



    
    var params= {
        action:'get_galleries',
        page:1
    }
    $.get('http://rockandclick.cl/wp-admin/admin-ajax.php',params,function(data){
        $("#galeria_div").html("");
        var newGall = $("<div/>");  
        //$("#galeria_div").append(data);
        $.each($(data).find(".title"),function(i,div){
            newGall.append(
                $("<div/>").attr("id","galeria" + i )
                .append(
                    $("<h1>").addClass("titulo_galeria").text(
                        $(div).text()
                        )
                    )
                );
        })
        $.each($(data).find(".images"),function(i,div){
            var imagesDiv = $(div);
            var gal = i
            $.each(imagesDiv.children(),function(i,a){
    
                //var tot = jsonGalerias.galerias[gal].images.length
                //jsonGalerias.galerias[gal].images[tot]= $(a).children().attr("src");
                if(i<4){
                    data = {
                        id:buscaId($(newGall).children("#galeria"+gal).children("h1").text())
                        }
                        
                    $(newGall).children("#galeria"+gal).append(
                        $("<img/>").addClass("img_galeria").data("data",data)
                        .attr("src",$(a).children()
                            .attr("src")
                            ))
                }

            })



        })

        $("#galeria_div").html("");
        $("#galeria_div").append($(newGall));

        $(".img_galeria").on("vclick",function(){
            galeriaSeleccionada = $(this).data().data.id;
            $.mobile.changePage("#detalle_galeria");
            traeGaleriaPlayer(galeriaSeleccionada)
        })
        $.mobile.hidePageLoadingMsg();
    });

} 
descargaGaleria = function (idGaleria){
    if (navigator.network.connection.type == "wifi" ){
    var params= {
        action:'get_galeryImages',
        gallery:imageList[ idGaleria]
    };
    try{
        alert("Se descargara la galeria, este proceso puede tardar...");
        $.mobile.showPageLoadingMsg();
        $.get('http://rockandclick.cl/wp-admin/admin-ajax.php',params,function(data){
            jsonDescarga = JSON.parse(data);
            var exitoDescarga= true;
            var totalImagenes = jsonGaleria.gallery.length;
            $.each(jsonDescarga.gallery,function(i,e){
                
                Downloader.prototype.downloadFile(
                    e.image,
                    {
                        dirName:'sdcard/rockandclick/'+ nombreGaleria
                    },
                    function(e){
                        if(e.status== 1 && totalImagenes == i && exitoDescarga == true ){
                            alert("La Galeria fue descargada con exito!");
                               $.mobile.hidePageLoadingMsg();
                        }
                    },
                    function(e){
                        exitoDescarga= false;
                        alert("Error, al intentar obtener las Imágenes");
                    }
                    )
                $.mobile.hidePageLoadingMsg();
            });
        })
    }
    catch(e){
        $.mobile.hidePageLoadingMsg();

    }
}else {
     alert("Esta operación esta solo disponible con Wi-FI");
}
}

descargaWallpaper = function  (url){
if (navigator.network.connection.type == "wifi" ){
  alert("Este proceso puede tardar");
   $.mobile.showPageLoadingMsg();
    var sdPath = 'sdcard/rockandclick/Wallpapers/';
    Downloader.prototype.downloadFile(
        url,
        {
            dirName:sdPath
        },
        function(e){
            
            if(e.status== 1){
                
                   PhoneGap.exec(function(args) {
                    $.mobile.hidePageLoadingMsg();
                    alert("La imagen se ha descargado exitosamente");

                }, function(args) {
                    JSON.stringify(args)

                }, 'WebIntent', 'custom', [{
                    action:"setWallpaper",
                    "path":sdPath+e.file
                    }])
          
                return false;
            }
        }
        ,
        function(e){
          
            exitoDescarga= false;
            alert("Error, al intentar obtener las Imágenes")
        })
    return false;
}
else{
    alert("Esta operación esta solo disponible con Wi-FI");
}
}

traeWallpapers = function (){
    $.mobile.showPageLoadingMsg();
    $.getJSON('http://rockandclick.cl/wallpapers/?json=1',function(data){
  
        jsonWallpapers = data;
        var newWall = $("<div/>");  
        $("#lista_walpapers").html("");
         $.each(jsonWallpapers.page.attachments, function(i,e){
              $(newWall).append( $("<img/>").on("click",function(){
                var obj= $(this).data().data;
                $.mobile.changePage("#wallpaperDownload");
                $("#wall_img_principal").data("data", obj)
                .attr("src",obj.images.thumbnail.url)
                .addClass("wall_img_principal")
                .width("90%")
                $("#liHD").text("HD - " + obj.images.full.width + " X " + obj.images.full.height)
                $("#liSD").text("SD - " + obj.images.medium.width + " X " + obj.images.medium.height)                       
            })
            .addClass("img_wallpaper")
            .attr("src", e.images.thumbnail.url ).data("data",e))

        })
        //$("#lista_walpapers").html("");
        $("#lista_walpapers").append($(newWall));


        $.mobile.hidePageLoadingMsg();

    });

}

 iniciaPanel = function(){
    $(".img_menu").on('vmousedown',function(){
        $(this).addClass("img_menu_hover");
    })
    $(".img_menu").on('vmouseup',function(){
        $(this).removeClass("img_menu_hover");
        $('.menu_flotante').slideToggle('fast', function() {});
    })
}


onDeviceReady = function(){
    networkState = navigator.network.connection.type;
    
    if( networkState == "none"){
        document.removeEventListener("deviceready", onDeviceReady, false)
        $.mobile.changePage("#errorPage");
        document.addEventListener("backbutton", function(){device.exitApp();}, false);
              
    }
}


botonera={
reproduce:true,
play:function(){
botonera.reproduce = true
botonera.cambiaImagen()
},
pause:function(){
botonera.reproduce = false
},
back:function(){
try{
        if(iAPlayer >= iTPlayer)
        {
            iAPlayer=0;
        }else{
            iAPlayer--;
        }

        $("#post_img_principal2").attr("src",jsonGaleriaPlayer.gallery[iAPlayer].image)
        ajustaImagen();
      }catch(e){
 
    }
},
next:function(){
try{
        if(iAPlayer >= iTPlayer)
        {
            iAPlayer=0;
        }else{
            iAPlayer++;
        }

        $("#post_img_principal2").attr("src",jsonGaleriaPlayer.gallery[iAPlayer].image)
        ajustaImagen();
      }catch(e){
 
    }
},
cambiaImagen: function(){
 
if(botonera.reproduce){
 
    try{
        if(iAPlayer >= iTPlayer)
        {
            iAPlayer=0;
        }else{
            
            iAPlayer++;
        }
        $("#post_img_principal2").attr("src",jsonGaleriaPlayer.gallery[iAPlayer].image)
        ajustaImagen();
      }catch(e){
 
    }
    
    setTimeout("botonera.cambiaImagen()", 6000);
  }
}

}

/*-------------------------INIT---------*/

$(function(){

  $.get('http://rockandclick.cl/wp-admin/admin-ajax.php',params,function(data){
        imageList = JSON.parse(data);
    });


})


$(document).bind('pageinit',function(){

if (!mostroSplash){
$("#splash_img_full").show().attr("src","img/sony.png").width($(window).width()).height($(window).height())
mostroSplash = true;
}

  document.addEventListener("deviceready", onDeviceReady, false);
  
  

    traePost();

    $("body").on("pagebeforeload", function(){
        iniciaPanel();
          $.mobile.showPageLoadingMsg();

        $(".ui-btn").on('vmousedown',function(){
            $(this).removeClass("ui-btn-up-a");

            $(this).addClass("ui-btn-hove-a");
        });
        $(".ui-btn").on('vmouseup',function(){
            $(this).addClass("ui-btn-up-a");
            $(this).removeClass("ui-btn-hove-a");
        });  
        
    })





    $(document).bind( "pageshow", function( e, data ) {
        $(".ui-content").css("min-height",$(window).height())
    })

    $("#galeria_img_full").css("display","none")
    $(".post_img_principal2")
      .click(function(){
          $("#galeria_img_full").attr("src",$(".post_img_principal2").attr("src"))
          .fadeIn()
          .width($(window).width())
          .height($(window).height())
          .click(function(){
              $(this).fadeOut();
          })
      }) 


})
function init(){
  
    $(".menu_flotante").css("display","none")
    myPrincipalWidth = $('.post_img_principal').width();
    myPrincipalHeiht = $('.post_img_principal').height();
    myContentHeight  = $(".post_div_principal").height();
    myGaleryWidth    = $('.img_carrusel').width();
    myGaleryHeight   = $('.img_carrusel').height();

    
    if (!iniciado){
        iniciado = true;
        iniciaPanel()
    }
    setTimeout("$('#splash_img_full').fadeOut()",5000)
}


$(window).on("orientationchange",function(){
    ajustaImagen()
})


function ajustaImagen(){
    $(".post_div_principal").height(300);
    $("#post_img_principal").css("max-height",300)
}


function cambiaImagen(){

    try{
        if(iA >= iT)
        {
            iA=0;
        }else{
            iA++;
        }

        $("#post_img_principal").attr("src",jsonGaleria.gallery[iA].image)
        ajustaImagen();
        $(".post_img_carusel_rigth").attr("src",jsonGaleria.gallery[(iA +1==iT-1?0:iA+1)].thumb)
        $(".post_img_carusel_center").attr("src",jsonGaleria.gallery[iA +2==iT-1?0:iA+2].thumb)
        $(".post_img_carusel_left").attr("src",jsonGaleria.gallery[iA +3==iT-1?0:iA+3].thumb)
    }catch(e){
 
    }
    setTimeout("cambiaImagen()", 6000);
}

 


