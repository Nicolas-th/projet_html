<?php
class SQL{

	private $pdo;
	private $requete;
	
	public function __construct($pdo=null){
		if($pdo!=null){
			$this->pdo = $pdo;
		}
	}
	
	public function __destruct(){
		$this->deconnexionBDD();
	}
	
	private function connexionBDD($host,$database,$user,$password){
		try{
			$this->pdo=new PDO("mysql:host=".$host.";dbname=".$database, $user, $password);
			$this->pdo->query("SET NAMES utf8");
			$this->pdo->query("SET CHARACTER SET 'utf8'");
			$this->pdo->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
		}
		catch(Exception $e){
			return false;
		}
	}
	
	public function deconnexionBDD(){
		$this->pdo = null ;
	}

	public function prepare($requeteIn){
		$this->requete = $this->pdo->prepare($requeteIn);
	}

	public function bindValue($nom, $contenu, $type){
		$this->requete->bindValue($nom, $contenu, $type);
	}
	
	public function execute($is_retour=false){		
		try{
			$this->requete->execute();
			if($is_retour==true)  	$nbreponse = $this->requete->rowCount();
		}
		catch(Exception $e){
			return false;
		}
		if($is_retour){
			if($nbreponse>0){
				$retour = array();
				$i=0;
				$ligne=$this->requete->fetch(PDO::FETCH_ASSOC);
				while($ligne!=false){
					foreach($ligne as $champ => $valeur){
						$retour[$i][$champ]=$valeur;
					}
					$i++;
					$ligne=$this->requete->fetch(PDO::FETCH_ASSOC);
				}
				return $retour;
			}else{
				return false;
			}
		}
	}

	public function lastInsertId(){
		return $this->pdo->lastInsertId();
	}
	
	
}
?>