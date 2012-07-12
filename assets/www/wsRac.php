<?

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
 $post = $_POST["txtPost"];
 $galeria = $_POST["txtGaleria"];

 $link=Conectarse(); 
 $query = "insert into Imagenes (Post, galeria) values (".$post.",".$galeria.");";
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


$metodo = $_POST["metodo"];

if ($metodo == "insertConcierto")
{
insertConcierto();

}

if  ($metodo == "getListaImagenes"){
getListaImagenes();

}



?>
