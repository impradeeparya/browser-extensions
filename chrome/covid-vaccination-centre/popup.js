let findButton = document.getElementById("find");

findButton.addEventListener("click", async () => {
  await setInterval(function() {
    let pincode = document.getElementById("pincode").value;
    let today = new Date().toLocaleDateString();
    var url = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=' + pincode + '&date=' + today
    const response = fetch(url)
      .then(
        function(response) {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }

          response.json().then(function(data) {
            console.log(data);
            let vaccinationInfo = document.getElementById('vaccination-info');
            vaccinationInfo.innerHTML = "";
            vaccinationInfo.appendChild(populateVaccinationCentersData(data['sessions']));
             chrome.runtime.sendMessage('', {
               type: 'notification',
               options: {
                 title: 'Just wanted to notify you',
                 message: 'Vaccine slot is available',
                 iconUrl: '/images/vaccine_finder16.png',
                 type: 'basic',
                 priority: 1
               }
             });
          });
        }
      )
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
  }, 2000);
});


function populateHeaders(row) {
  row.appendChild(document.createElement('td'));
  row.cells[0].appendChild(document.createTextNode('Centre'));
  row.appendChild(document.createElement('td'));
  row.cells[1].appendChild(document.createTextNode('Date'));
  row.appendChild(document.createElement('td'));
  row.cells[2].appendChild(document.createTextNode('District'));
  row.appendChild(document.createElement('td'));
  row.cells[3].appendChild(document.createTextNode('Pincode'));
  row.appendChild(document.createElement('td'));
  row.cells[4].appendChild(document.createTextNode('Vaccine'));
  row.appendChild(document.createElement('td'));
  row.cells[5].appendChild(document.createTextNode('Available Dose 1'));
  row.appendChild(document.createElement('td'));
  row.cells[6].appendChild(document.createTextNode('Available Dose 2'));
  row.appendChild(document.createElement('td'));
  row.cells[7].appendChild(document.createTextNode('Age'));
  row.appendChild(document.createElement('td'));
  row.cells[8].appendChild(document.createTextNode('Free/Paid'));

}

function populateVaccinationCenterData(centreInfo, row) {
  row.appendChild(document.createElement('td'));
  row.cells[0].appendChild(document.createTextNode(centreInfo.name));
  row.appendChild(document.createElement('td'));
  row.cells[1].appendChild(document.createTextNode(centreInfo.date));
  row.appendChild(document.createElement('td'));
  row.cells[2].appendChild(document.createTextNode(centreInfo.district_name));
  row.appendChild(document.createElement('td'));
  row.cells[3].appendChild(document.createTextNode(centreInfo.pincode));
  row.appendChild(document.createElement('td'));
  row.cells[4].appendChild(document.createTextNode(centreInfo.vaccine));
  row.appendChild(document.createElement('td'));
  row.cells[5].appendChild(document.createTextNode(centreInfo.available_capacity_dose1));
  row.appendChild(document.createElement('td'));
  row.cells[6].appendChild(document.createTextNode(centreInfo.available_capacity_dose2));
  row.appendChild(document.createElement('td'));
  row.cells[7].appendChild(document.createTextNode(centreInfo.min_age_limit));
  row.appendChild(document.createElement('td'));
  row.cells[8].appendChild(document.createTextNode(centreInfo.fee_type));
}

function populateVaccinationCentersData(centresInfo) {
  table = document.createElement('table');
  var header = document.createElement('tr');
  populateHeaders(header)
  table.appendChild(header);
  var numberOfCentres = centresInfo.length;
  for (var index = 0; index < numberOfCentres; index++) {
    var row = document.createElement('tr');
    var centreInfo = centresInfo[index]
    if(centreInfo.fee_type == 'Free' && centreInfo.vaccine == 'COVAXIN')
      populateVaccinationCenterData(centreInfo, row);
      table.appendChild(row);
  }
  return table;
}
