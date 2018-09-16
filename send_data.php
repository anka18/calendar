<?php 
	if (isset($_POST)) { 	
		$data = file_get_contents("php://input");
    	$fp = fopen('months.json', 'w');
		fwrite($fp, $data); 
		fclose($fp);
	}
 ?>