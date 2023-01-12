
/*********************** Agenda *****************/
/**
* @author Elie Andriatsitohaina <elie@geomadagascar.com>
*/

const currentDate = document.querySelector(".current-date"),
calendar = document.querySelector(".calendar"),
prevNextIcon = document.querySelectorAll(".icons span");

/* creation calendrier */
let daysName = document.createElement("ul");
let daysNumber = document.createElement("ul");
daysName.classList ="weeks";
daysNumber.classList ="days";

// getting new date, current year and month
let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();

// Listes des mois et liste des jour
const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet",
              "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const days = ["Dim","Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]

for(day of days){
  let daysLi = document.createElement("li")
  daysLi.textContent = day;
  daysName.appendChild(daysLi)
}

calendar.appendChild(daysName);
calendar.appendChild(daysNumber);

let daysTag = document.querySelector(".days");

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), 
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), 
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); 
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += "<li class='inactive'>" + (lastDateofLastMonth - i + 1) +"</li>";
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
        // adding active class to li if the current day, month, and year matched
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                     && currYear === new Date().getFullYear() ? "active" : "";

		let dateLabel = i < 10 ? "0"+i : i;
		let monthLabel = (currMonth+1) < 10 ? "0"+(currMonth+1) : (currMonth+1)

		let dateSimple = currYear+ "-"+monthLabel+"-"+dateLabel;

		testHasAgenda("agenda1", dateSimple, i)

		//console.log(dateSimple + " "+hasEvent);

        liTag += "<li class='" +isToday+" current-day-"+i +"' ondblclick=\"addDateEvent("+i+")\" onmouseover=\"mouseOverEvent("+i+")\">"+i+"</li>";
    }

    for (let i = lastDayofMonth; i < 6; i++) { 
        liTag += "<li class='inactive' >"+ (i - lastDayofMonth + 1) +"</li>"
    }
	//console.log("LOTAG " + liTag);

	if(currentDate != null){
		currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
    	
	}
	daysTag.innerHTML = liTag;
    
}
renderCalendar();

prevNextIcon.forEach(icon => { 
    icon.addEventListener("click", () => { 
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if(currMonth < 0 || currMonth > 11) { 
            date = new Date(currYear, currMonth);
            currYear = date.getFullYear(); 
            currMonth = date.getMonth(); 
        } else {
            date = new Date(); 
        }
        renderCalendar();
    });
});

const addDateEvent =(date)=>{
	let date_clicked = date +" "+document.querySelector("#current-date").textContent;
	let monthName = date_clicked.replace(/[0-9]/g,"");
	let indexOfMonth = months.indexOf(monthName.trim())+1;
	let annee = document.querySelector("#current-date").textContent.replace(/[^0-9]/g,"")

	let dateLabel =date < 10 ? "0"+date : date;
	let moisLabel =indexOfMonth < 10 ? "0"+indexOfMonth : indexOfMonth;
	
	let dateSimple = annee+"-"+moisLabel+"-"+dateLabel;

	let dateFormatStart = annee+"-"+moisLabel+"-"+dateLabel +" 00:00:00";
	let dateFormatEnd = annee+"-"+moisLabel+"-"+dateLabel +" 23:59:59";

    document.querySelector(".tooltipss").style.display ="block";
	document.querySelector("#agenda-fetched").innerHTML = `<div class="row g-2 mt-2">
			<div class="col-md">
				<div class="form-floating">
					<select class="form-select" id="agenda-type">
						<option selected>Type d'agenda</option>
						<option value="1">Evenement</option>
						<option value="2">Tâche</option>
						<option value="3">Rappel</option>
					</select>
					<label for="floatingSelectGrid">Créer...</label>
				</div>
			</div>
			<div class="col-md">
				<div class="form-floating">
					<input type="text" class="form-control" id="agenda-title" placeholder="Ecire le titre">
					<label for="floatingInputGrid">Titre</label>
				</div>
			</div>
			
		</div>
		
		<div class="row g-2 mt-2">
			<div class="col-6">
				<div class="form-floating">
					<input type="datetime-local" class="form-control" id="agenda-from"value="${dateFormatStart}">
					<label for="floatingInputGrid">De</label>
				</div>
			</div>
			<div class="col-6">
				<div class="form-floating">
					<input type="datetime-local" class="form-control" id="agenda-to" value="${dateFormatEnd}">
					<label for="floatingInputGridd">Vers</label>
				</div>
			</div>
		</div>

		<div class="row g-2 mt-2 mb-2">
			<input type="hidden" id="agenda-lat">
			<input type="hidden" id="agenda-lng">
			<div id="map" style="width:100%; height : 150px;"></div>
		</div>

		<div class="row g-2 mt-2 mb-2">
			<input type="button" class="btn btn-outline-primary" onclick="saveAgenda()" id="" value="Enregistrer">
		</div>`;
   
   	let map = L.map('map').setView([48.864716, 2.349014], 13);

	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 20,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);
	
	let marker = L.marker([48.864716, 2.349014]).addTo(map);

	map.on('click', function(e){
		marker.setLatLng(e.latlng)
		document.querySelector("#agenda-lat").value = e.latlng.lat
		document.querySelector("#agenda-lng").value = e.latlng.lng
	});

  
}

const mouseOverEvent =(date)=>{
	let date_clicked = date +" "+document.querySelector("#current-date").textContent;
	//document.querySelector(".real-day-"+date).classList.toggle("hasEvent");
	let classNames = ""+document.querySelector(".current-day-"+date).classList;

	if(classNames.includes('hasEvent')==true){
		document.querySelector(".tooltipss").style.display ="block";

		let monthName = date_clicked.replace(/[0-9]/g,"");
		let indexOfMonth = months.indexOf(monthName.trim())+1;
		let annee = document.querySelector("#current-date").textContent.replace(/[^0-9]/g,"")

		let dateLabel =date < 10 ? "0"+date : date;
		let moisLabel =indexOfMonth < 10 ? "0"+indexOfMonth : indexOfMonth;

		let dateSimple = annee+"-"+moisLabel+"-"+dateLabel;
		
		getAgendaByDatetime("agenda1",dateSimple);

	}/*else{
		document.querySelector(".tooltipss").style.display ="none";
	}*/

  
}

function getAgendaByDatetime(table_name,datetime){
	fetch('/user/get_agenda_by_date/'+table_name+"/"+datetime)
	.then(response => response.json())
	.then(data => {
		let res = ""
		if(data.length>0){
			for(let agenda of data){
				res +=`
					<a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
						<div class="d-flex w-100 justify-content-between">
						<h5 class="mb-1">${agenda.title}</h5>
						<small> ${differenceDay(agenda.from_date)}</small>
						</div>
						<p class="mb-1">Date : ${agenda.from_date +" - "+agenda.to_date}</p>
						<small><i class="bi bi-calendar-check-fill"> </i>${agenda.type}</small>
					</a>
					`;
			}
		}
		document.querySelector("#agenda-fetched").innerHTML = `<div class="list-group mt-2 mb-2">${res}</div>`;
	});

}

function differenceDay(dayStart){
	let d1 = new Date();   
	let d2 = new Date(dayStart);   
		
	let diff = d2.getTime() - d1.getTime();

	let daydiff = diff / (1000 * 60 * 60 * 24);  
	let dayRound =  Math.round(daydiff * 10)/10;

	if(dayRound >= 1){
		return "dans "+dayRound+" jour(s)"
	}else if(dayRound <= -1){
		return "il y a "+Math.abs(dayRound)+" jour(s)"
	}else{
		return "aujourd'hui"
	}
}

function getAgendaByType(table_name,type){
	fetch('/user/get_agenda_by_type/'+table_name+"/"+type)
	.then(response => response.json())
	.then(data => {
		let resStatu0 = "";
		let resStatu1 = "";
		
		if(data.length>0){
			for(let agenda of data){
				if(agenda.status==0){
					resStatu0 += ` <div id="yes-drop" class="drag-drop">
								<input type="hidden" value='${agenda.id}'>
								${agenda.title}
								<hr>
								<p>Du ${agenda.from_date}</p>
								<p>Vers ${agenda.to_date}</p>
								<a href="#" >Voir plus...</a>
							</div> `;
				}else{
					resStatu1 += ` <div id="yes-drop" class="drag-drop">
								<input type="hidden" value='${agenda.id}'>
								${agenda.title}
								<hr>
								<p>Du ${agenda.from_date}</p>
								<p>Vers ${agenda.to_date}</p>
								<a href="#" >Voir plus...</a>
							</div> `;
				}
				
			}
		}
		document.querySelector("#agenda-fetched").innerHTML = `<div class="container text-center">
					<div class="row mt-2 mb-2">
						<div class="col-6"><i class="bi bi-exclamation-octagon badge bg-info"> En cours</i></div>
						<div class="col-6"><i class="bi bi-check2-circle badge bg-success"> Términé</i></div>

						<div class="col-6">
							<div id="inner-dropzone" class="dropzone">
							` + resStatu0 + `
							</div>
						</div>
						<div class="col-6">
						
							<div id="outer-dropzone" class="dropzone">
							` + resStatu1 + `
							</div>
						</div>
					</div>
					`;
	});

}


function saveAgenda(){
	let typeAgenda = document.querySelector("#agenda-type").value
	let typeFinal = "";

	switch (typeAgenda) {
		case "1":
			typeFinal ="Evenement"
			break;
		case "2":
			typeFinal ="Tâche"
			break;
		case "3":
			typeFinal ="Rappel"
			break;
		default:
			typeFinal ="Indéfinie"
	}

	let data = {
		"title": document.querySelector("#agenda-title").value,
		"type": typeFinal,
		"to": document.querySelector("#agenda-to").value.replace(/T/g," ")+":00",
		"from": document.querySelector("#agenda-from").value.replace(/T/g," ")+":00",
		"lat": document.querySelector("#agenda-lat").value,
		"lng": document.querySelector("#agenda-lng").value
	}

	// console.log(data);
	let table = "agenda1";

	fetch(new Request("/user/new_agenda/agenda1", {
	method: "POST",
	headers: {
	'Accept': 'application/json',
	'Content-Type': 'application/json'
	},
	body: JSON.stringify(data)
	})).then(req => req.json()).then(message => {
		let state = document.createElement("div")
		state.setAttribute("id", "agenda-success");
		document.querySelector("#agenda-fetched").appendChild(state);
		document.querySelector("#agenda-success").innerHTML = `<div class="alert alert-success mt-2" role="alert"><i class="bi bi-check2-circle"> </i>
					Agenda sauvegardé avec succès
					</div>`
	});
	console.log(data);
}

function testHasAgenda(tablename, date, i){
	fetch("/user/has_agenda/"+tablename+"/"+date)
	.then(response => response.text())
	.then(data => {
		if(data=="true"){
			document.querySelector(".current-day-"+i).classList.add("hasEvent");
		}
	})
	
}

function updateAgenda(table, data){
	fetch(new Request("/user/update_agenda/"+table, {
	method: "POST",
	headers: {
	'Accept': 'application/json',
	'Content-Type': 'application/json'
	},
	body: JSON.stringify(data)
	})).then(req => req.json()).then(message => {
		console.log(message);
})
}

let changeType = document.querySelector("#data-view");
document.querySelectorAll("#modal_evenement > div > div > div.modal-header > div > ul > li").forEach(item =>{
	item.addEventListener("click", function(){
		//console.log(item.textContent)
		if(item.textContent.trim() != "Calendrier"){
			document.querySelector("#agenda").style.display ="none";
			document.querySelector(".tooltipss").style.display ="block";
			changeType.innerHTML = "<i class='bi bi-eye'></i> " + item.textContent
			
			getAgendaByType("agenda1",item.textContent.trim())
		}else{
			document.querySelector("#agenda").style.display ="block";
			document.querySelector(".tooltipss").style.display ="none";
			changeType.innerHTML = "<i class='bi bi-eye'></i> " + item.textContent
		}
		
	})
})


/* The dragging code for '.draggable' from the demo above
* applies to this demo as well so it doesn't have to be repeated. */

interact('.drag-drop')
  .draggable({
    inertia: false,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'child',//parent si meme chemin
        endOnly: true
      })
    ],
    autoScroll: true,
    // dragMoveListener from the dragging demo above
    listeners: { move: dragMoveListener }
  })

function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  // this is used later in the resizing demo
  window.dragMoveListener = dragMoveListener;


    // enable draggables to be dropped into this
    interact('.dropzone').dropzone({
      accept: '#yes-drop',
      overlap: 0.75,

      // listen for drop related events:

      ondropactivate: function (event) {
        // add active dropzone feedback
        event.target.classList.add('drop-active');
      },
      ondragenter: function (event) {
        var draggableElement = event.relatedTarget,
            dropzoneElement = event.target;

        // feedback the possibility of a drop
        dropzoneElement.classList.add('drop-target');
        draggableElement.classList.add('can-drop');
        //draggableElement.textContent = 'Dragged in';
      },
      ondragleave: function (event) {
        // remove the drop feedback style
        event.target.classList.remove('drop-target');
        event.relatedTarget.classList.remove('can-drop');
        //event.relatedTarget.textContent = 'Dragged out';
      },
      ondrop: function (event) {
        //event.relatedTarget.textContent = 'Dropped';

		let status = event.target.id == "outer-dropzone"? 1 : 0;
		let id= event.relatedTarget.querySelector("input").value
		let type= document.querySelector("#data-view").textContent.trim()
		let data = {
			id : id,
			status : status
		}
		updateAgenda("agenda1", data)
		getAgendaByType("agenda1",type)
      },
      ondropdeactivate: function (event) {
        // remove active dropzone feedback
        event.target.classList.remove('drop-active');
        event.target.classList.remove('drop-target');
      }
    });