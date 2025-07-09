document.addEventListener("DOMContentLoaded", async () => {
  const registration_form = document.getElementById("RegistrationForm");
  const link_registration = document.getElementById("registration");
  const login_form = document.getElementById("loginForm");
  const link_login = document.getElementById("login");
  const form_container = document.getElementById("formContainer");
  const app_container = document.getElementById("appContainer");
  const user_info = document.getElementById("userInfo");
  const doctors_list = document.getElementById("doctorsList");
  const ths = document.querySelectorAll("th");
  const patients_list = document.getElementById("patientsList");
  const tables = document.getElementById("tables");
  const form = document.getElementById("form");
  const form_submit = document.getElementById("formSubmit");
  const appointment_form = document.getElementById("appointmentForm");
  const doctors_options = document.getElementById("doctorsOption");
  const service_options = document.getElementById("serviceOption");
  const patients_table = document.getElementById("patientsBody");
  const submit_button = document.getElementById("submitButton");

  ths.forEach((th) => th.classList.add("border"));
  ths.forEach((th) => th.classList.add("border-black"));


  const patientsList = await window.api.getPatientList();
  patientsList.rows.forEach((patient) => {
    addDataToTable(patient);
  });

  let id_data_edit;

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
        `<li class="h-[40px] cursor-pointer border-b border-black flex justify-center items-center" id="${doctor.name}">Dr. ${doctor.name}</li>`
    )
    .join("");

  const li_items = document.querySelectorAll("li");
  li_items.forEach((li) => {
    li.addEventListener("click", async () => {
      const doctor_name = li.innerText.replace(/^Dr\. /, "");
      const patientsList = await window.api.getPatientList();
      const list = patientsList.rows.filter(
        (patient) => patient.doctor === doctor_name
      );
      patients_table.innerHTML = "";
      list.forEach((item) => {
        addDataToTable(item);
      });
    });
  });

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

  patients_list.addEventListener("click", async () => {
    patients_table.innerHTML = "";
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

  tables.addEventListener("click", async function (event) {
    if (event.target && event.target.id === "edit") {
      form.classList.remove("hidden");
      tables.classList.add("hidden");
      const row = event.target.closest("tr");
      const rowData = Array.from(row.cells).map((cell) => cell.textContent);
      const id = +rowData[2];
      const patientsList = await window.api.getPatientList();
      const patient_data = patientsList.rows.filter(
        (patient) => patient.id === id
      );
      id_data_edit = id;
      form_submit.patientName.value = patient_data[0].name;
      form_submit.insuranceNumber.value = patient_data[0].insurance;
      form_submit.doctorsOption.value = patient_data[0].doctor;
      form_submit.serviceOption.value = patient_data[0].service;
      form_submit.date.value = patient_data[0].date;
      form_submit.time.value = patient_data[0].time;
      submit_button.innerText = "Edit";
      console.log("id", id_data_edit);
    }
  });

  tables.addEventListener("click", async function (event) {
    if (event.target && event.target.id === "cancel") {
      const row = event.target.closest("tr");
      const rowData = Array.from(row.cells).map((cell) => cell.textContent);
      const id = +rowData[2];
      const response = await window.api.cancel(id);
      if (response.success) {
        console.log(response.message);
        patients_table.innerHTML = "";
        const patientsList = await window.api.getPatientList();
        patientsList.rows.forEach((patient) => {
          addDataToTable(patient);
        });
      }else{
        console.log("Error in canceling process!");
      }
    }
  });

  form_submit.addEventListener("submit", async (e) => {
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
    if (submit_button.innerText === "Submit") {
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
          resetForm();
        } else {
          console.log("Error in setting appointment, please try again");
        }
      }
    } else {
      const response = await window.api.editData({ data, id: id_data_edit });
      if (response.success) {
        console.log(response.message);
        resetForm();
      } else {
        console.log("Error in updating process!");
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

  const resetForm = async () => {
    form_submit.patientName.value = "";
    form_submit.insuranceNumber.value = "";
    form_submit.doctorsOption.value = "";
    form_submit.serviceOption.value = "";
    form_submit.date.value = "";
    form_submit.time.value = "";
    id_data_edit = null;
    submit_button.innerText = "Submit";
    form.classList.add("hidden");
    tables.classList.remove("hidden");
    patients_table.innerHTML = "";
    const patientsList = await window.api.getPatientList();
    patientsList.rows.forEach((patient) => {
      addDataToTable(patient);
    });
  };

  function addDataToTable(data) {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td class="border border-black pl-2">${data.name}</td>
        <td class="border border-black pl-2">${data.insurance}</td>
        <td class="border border-black pl-2">${data.id}</td>
        <td class="border border-black pl-2">${data.doctor}</td>
        <td class="border border-black pl-2">${data.date}</td>
        <td class="border border-black pl-2">${data.time}</td>
        <td class="border border-black pl-2">${data.service}</td>
        <td class="border border-black text-center"><a href="#" id="edit">Edit</a> / <a href="#" id="cancel">Cancel</a></td>
      `;
    patients_table.appendChild(newRow);
  }
});
