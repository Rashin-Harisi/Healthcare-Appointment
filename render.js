document.addEventListener("DOMContentLoaded", async () => {
  const registration_form = document.getElementById("RegistrationForm");
  const link_registration = document.getElementById("registration");
  const login_form = document.getElementById("loginForm");
  const link_login = document.getElementById("login");
  const register_button = document.getElementById("registerButton");
  const login_button = document.getElementById("loginButton");
  const form_container = document.getElementById("formContainer");
  const app_container = document.getElementById("appContainer");
  const user_info = document.getElementById("userInfo");
  const doctors_list = document.getElementById("doctorsList");
  const ths = document.querySelectorAll("th");
  const patients_list = document.getElementById("patientsList");
  const tables = document.getElementById("tables");
  const form = document.getElementById("form");
  const appointment_form = document.getElementById("appointmentForm");
  const doctors_options = document.getElementById("doctorsOption");
  const service_options = document.getElementById("serviceOption");
  const patients_table = document.getElementById("patientsBody");

  ths.forEach((th) => th.classList.add("border"));

  const patientsList = await window.api.getPatientList();
  patientsList.rows.forEach((patient) => {
    addDataToTable(patient);
  });


  const doctors_services = [
    {
      name: "Alex Carter",
      services: [
        "Diagnostic Imaging",
        "fracture management",
        "physical therapy",
        "Allergy Testing",
      ],
    },
    {
      name: "Sophia Bennett",
      services: [
        "Pediatric Care",
        "ECGs",
        "stress testing",
        "skin screening",
        "mole removal",
      ],
    },
    {
      name: "James Taylor",
      services: [
        "Emergency Medicine",
        "EEG",
        "headache management",
        "wellness exams",
        "chronic disease screening",
      ],
    },
  ];

  doctors_list.innerHTML = doctors_services
    .map(
      (doctor) =>
        `<li class="h-[40px] cursor-pointer border-b flex justify-center items-center" id="${doctor.name}">Dr. ${doctor.name}</li>`
    )
    .join("");



    const li_items = document.querySelectorAll("li")
    li_items.forEach((li)=>{
      li.addEventListener("click",async()=>{
        const doctor_name = li.innerText.replace(/^Dr\. /, "")
        const patientsList = await window.api.getPatientList();
        const list = patientsList.rows.filter(patient=> patient.doctor === doctor_name)
        patients_table.innerHTML= ""
        list.forEach((item)=>{addDataToTable(item)})          
        })
      })
    
    
    //console.log("doctor_add_event",doctor_add_event);

  doctors_options.innerHTML = doctors_services
    .map(
      (doctor) => `<option value="${doctor.name}">Dr. ${doctor.name}</option>`
    )
    .join("");

  service_options.innerHTML = doctors_services[0].services.map(
    (service) => `<option value="${service}">${service}</option>`
  );

  doctors_options.addEventListener("change", () => {
    const selectedDoctor = doctors_options.value;
    const doctor = doctors_services.find((doctor) =>
      doctor.name.includes(selectedDoctor)
    );
    service_options.innerHTML = doctor.services.map(
      (service) => `<option value="${service}">${service}</option>`
    );
  });

  patients_list.addEventListener("click",async () => {
    patients_table.innerHTML=""
    const patientsList = await window.api.getPatientList();
    patientsList.rows.forEach((patient) => {
      addDataToTable(patient);
    });
    form.classList.add("hidden");
    tables.classList.remove("hidden");
  });
  appointment_form.addEventListener("click", () => {
    form.classList.remove("hidden");
    tables.classList.add("hidden");
  });

  const lis = doctors_list.querySelectorAll("li");
  lis.forEach((li) => {
    li.addEventListener("click", () => {
      form.classList.add("hidden");
      tables.classList.remove("hidden");
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      patient_name: form.patientName.value,
      insurance_number: form.insuranceNumber.value,
      doctor_name: form.doctorsOption.value,
      service: form.serviceOption.value,
      date: form.date.value,
      time: form.time.value,
    };
    const patient_list_of_doctor = patientsList.rows.filter(
      (patient) => patient.doctor === form.doctorsOption.value
    );
    const time_list = patient_list_of_doctor.filter(
      (patient) => patient.date === form.date.value
    );
    const check_time = time_list.filter(
      (patient) => patient.time === form.time.value
    );
    if (check_time.length !== 0) {
      alert("The time is unavailable. Please try again.");
    } else {
      const response = await window.api.sendPatientDetails(data);
      if (response.success) {
        addDataToTable({
          name: response.data.patient_name,
          id: response.data.id,
          doctor: response.data.doctor_name,
          service: response.data.service,
          time: response.data.time,
          date: response.data.date,
          insurance: response.data.insurance_number,
        });
        form.patientName.value = "";
        form.insuranceNumber.value = "";
        form.doctorsOption.value = "";
        form.serviceOption.value = "";
        form.date.value = "";
        form.time.value = "";
      } else {
        console.log("Error in setting appointment, please try again");
      }
    }
  });

  registration_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form_Register = e.target;
    const userData_registration = {
      name: form_Register.nameRegistration.value,
      email: form_Register.emailRegistration.value,
      password: form_Register.passwordRegistration.value,
    };
    if (
      !userData_registration.name ||
      !userData_registration.email ||
      !userData_registration.password
    ) {
      alert("Please fill required inputs.");
      return;
    } else {
      const registerUser = await window.api.registerUser(userData_registration);
      console.log(registerUser.data);
      if (registerUser.success) {
        user_info.innerText = userData_registration.name;
        form_container.classList.add("hidden");
        app_container.classList.remove("hidden");
      } else {
        console.log(registerUser.message);
      }
    }
  });

  login_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form_login = e.target;
    const userData_login = {
      email: form_login.emailLogin.value,
      password: form_login.passwordLogin.value,
    };
    if (!userData_login.email || !userData_login.password) {
      console.log("Please fill required inputs.");
      return;
    } else {
      const response = await window.api.loginUser(userData_login);
      if (response.success) {
        user_info.innerText = response.data;
        form_container.classList.add("hidden");
        app_container.classList.remove("hidden");
      } else {
        console.log(response.message);
      }
    }
  });

  link_registration.addEventListener("click", () => {
    registration_form.classList.add("hidden");
    login_form.classList.remove("hidden");
  });
  link_login.addEventListener("click", () => {
    login_form.classList.add("hidden");
    registration_form.classList.remove("hidden");
  });

  function addDataToTable(data) {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td class="border border-gray-300 pl-2">${data.name}</td>
        <td class="border border-gray-300 pl-2">${data.insurance}</td>
        <td class="border border-gray-300 pl-2">${data.id}</td>
        <td class="border border-gray-300 pl-2">${data.doctor}</td>
        <td class="border border-gray-300 pl-2">${data.date}</td>
        <td class="border border-gray-300 pl-2">${data.time}</td>
        <td class="border border-gray-300 pl-2">${data.service}</td>
        <td class="border border-gray-300 text-center"><a href="#" id="edit">Edit</a> / <a href="#" id="cancel">Cancel</a></td>
      `;
    patients_table.appendChild(newRow);
  }
});
