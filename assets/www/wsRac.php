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
 $query = "insert into Imagenes (Post, galeria, video) values (".$post.",".$galeria.",".$video.");";
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
 $query = "select Post ,Video from Imagenes where Video <> '' order by Post desc  ";
 $myJson = "";
 $result=mysql_query($query,$link); 
    $rows = array();
    $numero_rows = mysql_num_rows($result);
    $i = 0;




   $iframeInicio = '<a href="#" class="iframeVideo"><iframe class="iframeVideo"  width="19em" height="60%" src="http://www.youtube.com/embed/';
   $iframeFin= '?autoplay=0" frameborder="0" allowfullscreen=""></iframe><div class="bloquea"></div></a>';
    while($r = mysql_fetch_assoc($result)) {

       
      $mystring =addslashes($r['Video']);
      $largo = strlen($mystring);
      $pos1 = strrpos($mystring, "?",0) +3;
      $pos2 = strrpos($mystring, "&",0);
      $url = substr($mystring, $pos1, 11);
      $myJson = $myJson.$iframeInicio.$url.$iframeFin;
               
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
