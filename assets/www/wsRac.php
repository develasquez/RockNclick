<?
header('Access-Control-Allow-Origin: *');
function Conectarse() 
{ 
   
   if (!($link=mysql_connect("localhost","root","devenew1"))) 
   { 
      echo '{"success":true, "data":[], "errors":"Error al conectar con la Base de Datos" }'; 
      exit(); 
   } 
   if (!mysql_select_db("rockandclick",$link)) 
   { 
      echo '{"success":true, "data":[], "errors":"Error seleccionando la base de datos" }'; 
      exit(); 
   } 
   return $link; 
} 







function insertConcierto(){
 $post = $_REQUEST["txtPost"];
 $galeria = $_REQUEST["txtGaleria"];
 $video = $_REQUEST["txtVideo"];

 $link=Conectarse(); 
 $query = "insert into Imagenes (Post, galeria, Video) values (".$post.",".$galeria.",'".$video."');";
 $result=mysql_query($query,$link); 
	echo '{"success":true, "data":"Ok", "errors":"" }';
}


function getListaImagenes(){

 $link=Conectarse(); 
 $query = "select Post ,galeria from Imagenes";
 $myJson = "{";
 $result=mysql_query($query,$link); 
    $rows = array();
    $numero_rows = mysql_num_rows($result);
    $i = 0;
  

   
    while($r = mysql_fetch_assoc($result)) {

    	$i = $i+1;
    	 $myJson =$myJson.'"'.$r['Post'].'":'.$r['galeria'];
    	 if($i < $numero_rows){
			$myJson =$myJson.',';
    	 }
    }

 $myJson =$myJson."}";

echo $myJson;
}





function getListaVideos(){

 $link=Conectarse(); 
 $query = "select Post ,Video from Imagenes where Video <> '' order by Post desc limit 9 ";
 $myJson = "";
 $result=mysql_query($query,$link); 
    $rows = array();
    $numero_rows = mysql_num_rows($result);
    $i = 0;




  
    while($r = mysql_fetch_assoc($result)) {

       
      $mystring ='<div class="iframeVideo"><img  width="100%" height="100%" src="video/thumbs/' . addslashes($r['Video']).'.png" video="'.addslashes($r['Video']).'.ogv" /></div>';
      $myJson = $myJson.$mystring;
               
    }


echo $myJson;
}




$metodo = $_REQUEST["metodo"];

if ($metodo == "insertConcierto")
{
insertConcierto();

}

if  ($metodo == "getListaImagenes"){
getListaImagenes();

}

if  ($metodo == "getListaVideos"){
getListaVideos();

}

?>
