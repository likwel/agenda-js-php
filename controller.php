/**
 * @Route("user/get_agenda_by_date/{tribut_name}/{datetime}" , name="get_agenda_by_date", methods={"POST", "GET"})
 */
public function getAgendaByDate($tribut_name,$datetime)
{
    

    $user = $this->getUser();

    $pdo = new PDOConnection();
    $conn = $pdo->getConnection();

    $membre = "SELECT * FROM $tribut_name where from_date like '%$datetime%' or to_date like '%$datetime%'";

    $stm = $conn->prepare($membre);
    $stm->execute();

    $result = $stm->fetchAll(PDO::FETCH_ASSOC);

    return  $this->json($result);

}

/**
 * @Route("user/get_agenda_by_type/{tribut_name}/{type}" , name="get_agenda_by_type", methods={"POST", "GET"})
 */
public function getAgendaByType($tribut_name, $type)
{
    

    $user = $this->getUser();

    $pdo = new PDOConnection();
    $conn = $pdo->getConnection();

    $membre = "SELECT * FROM $tribut_name where type = '$type'";

    $stm = $conn->prepare($membre);
    $stm->execute();

    $result = $stm->fetchAll(PDO::FETCH_ASSOC);
    //dd($result);
    return  $this->json($result);

}

/**
 * @Route("user/new_agenda/{tribut_name}" , name="new_agenda", methods={"POST"})
 */
public function createAgenda($tribut_name, Request $request)
{
    
    $user = $this->getUser();

    $user_id = $user->getId();

    $pdo = new PDOConnection();
    $conn = $pdo->getConnection();

    $requestContent = json_decode($request->getContent(), true);

    $title = $requestContent["title"];
    $type = $requestContent["type"];
    $from = $requestContent["from"];
    $to = $requestContent["to"];
    $lat = $requestContent["lat"];
    $lng = $requestContent["lng"];

    $sql = "INSERT INTO $tribut_name (`title`, `type`, `from_date`, `to_date`, `lat`, `lng`, `user_id`) VALUES (?, ?, ?, ?,?,?,?)";
        
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(1, $title);
    $stmt->bindParam(2, $type);
    $stmt->bindParam(3, $from);
    $stmt->bindParam(4, $to);
    $stmt->bindParam(5, $lat);
    $stmt->bindParam(6, $lng);
    $stmt->bindParam(7, $user_id);
    $stmt->execute();

    //$result = $stm->fetchAll(PDO::FETCH_ASSOC);

    return  $this->json("Agenda bien enregistré...");

}

/**
 * @Route("user/update_agenda/{tribut_name}" , name="update_agenda", methods={"POST","GET"})
 */
public function updateAgenda($tribut_name, Request $request)
{
    
    $user = $this->getUser();

    $pdo = new PDOConnection();
    $conn = $pdo->getConnection();

    $requestContent = json_decode($request->getContent(), true);

    $statu = $requestContent["status"];
    $id = $requestContent["id"];

    $sql = "UPDATE $tribut_name set status=? where id=?";
    $stm = $conn->prepare($sql);
    $stm->bindParam(1, $statu);
    $stm->bindParam(2, $id);
    $stm->execute();

    return  $this->json("Agenda bien upgradé");

}

/**
 * @Route("user/has_agenda/{tribut_name}/{date}" , name="has_agenda", methods={"POST","GET"})
 */
public function hasAgenda($tribut_name, $date)
{
    
    $pdo = new PDOConnection();
    $conn = $pdo->getConnection();

    $agenda = "SELECT * FROM $tribut_name where from_date like '%$date%' or to_date like '%$date%'";

    $stm = $conn->prepare($agenda);
    $stm->execute();

    $valiny = "";

    $result = $stm->fetchAll(PDO::FETCH_ASSOC);
    if(count($result) > 0){
        $valiny = true;
    }else{
        $valiny = false;
    }
    
    return  $this->json($valiny);

}