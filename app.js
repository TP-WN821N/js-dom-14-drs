let serach_input = document.getElementById('serach-input')
let selected = document.getElementById('selected')
let add_task = document.getElementById('add-task')
let input_form = document.getElementById('input-form')
let tbody = document.getElementById('tbody')
let madal = document.getElementById('madal')
let save_btn = document.getElementById('save-btn')
let close_btn = document.getElementById('close-btn')
let remove_btn = document.getElementById('remove-btn')
let form = {}
let userDate = JSON.parse(localStorage.getItem('users')) || []
let addOrEdite = -3
let searchValue = ""
let current_page = JSON.parse(localStorage.getItem("page")) ? +JSON.parse(localStorage.getItem("page")).page : 1
let custem_per_page = JSON.parse(localStorage.getItem("page")) ? +JSON.parse(localStorage.getItem("page")).select : 2

window.addEventListener('DOMContentLoaded', () => {
  displayWindow()
  add_task.addEventListener('click', () => {
    toggleMadal("flex")
    resetForm()
  })
  close_btn.addEventListener('click', (e) => {
    e.preventDefault()
    toggleMadal("none")
  })
  save_btn.addEventListener('click', (e) => {
    e.preventDefault()
    if (addOrEdite >= 0) {
      userDate[addOrEdite].first_name = input_form.querySelector(`[name="first_name"]`).value
      userDate[addOrEdite].last_name = input_form.querySelector(`[name="last_name"]`).value
      userDate[addOrEdite].phone_number = input_form.querySelector(`[name="phone_number"]`).value
      userDate[addOrEdite].age = input_form.querySelector(`[name="age"]`).value
      userDate[addOrEdite].email = input_form.querySelector(`[name="email"]`).value
    } else {
      userDate.push({ ...form, id: userDate.length > 0 ? userDate[userDate.length - 1].id + 1 : 1 })
    }
    setStorage()
    displayWindow()
    resetForm()
    toggleMadal("none")
    form = {}
  })
  JSON.parse(localStorage.getItem("page")) ? selected.value = +JSON.parse(localStorage.getItem("page")).select : 2
  remove_btn.addEventListener('click', (e) => {
    e.preventDefault()
    resetForm()
  })
  window.addEventListener('click', (e) => {
    if (e.target === madal) {
      toggleMadal("none")
    }
  })
})
selected.addEventListener('change', (e) => {
  custem_per_page = +e.target.value
  current_page = 1
  displayWindow()
  setStoragePage()
})

function toggleMadal(status) {
  madal.style.display = `${status}`
}

function heandleChange(event) {
  let { name, value } = event.target
  form = { ...form, [name]: value }
}
function resetForm() {
  input_form.reset()
}

function setStorage() {
  localStorage.setItem("users", JSON.stringify(userDate))
}

function displayWindow() {
  tbody.innerHTML = ""
  let start_index = (current_page - 1) * custem_per_page
  let end_index = start_index + custem_per_page
  page = userDate.slice(start_index, end_index)
  console.log(end_index);

  page.filter(item => {
    if (item.first_name.toLowerCase().includes(searchValue)) {
      return item
    }
    tbody.innerHTML = ""
  }).forEach((item, i) => {
    tbody.innerHTML += `
    <tr>
      <td class="border text-center">${i + 1}</td>
      <td class="border text-center">${item.first_name}</td>
      <td class="border text-center">${item.last_name}</td>
      <td class="border text-center">${item.age}</td>
      <td class="border text-center">${item.phone_number}</td>
      <td class="border text-center">${item.email}</td>
      <td class="flex justify-center gap-3 border">
      <button onclick="editeUser(${i})" class="bg-orange-400 text-white px-4 py-1 rounded my-1">Edit</button>
      <button onclick="deleteUser(${i})" id="delUser_${i}" class="bg-red-600 text-white px-4 py-1 rounded my-1">Delete</button>
      </td>
      </tr>
      `
  })
  pagination(userDate.length)
}

function pagination(total_user) {
  let pagination_box = document.getElementById('pagination')
  let pagination_count = Math.ceil(total_user / custem_per_page)
  pagination_box.innerHTML = ""
  for (let i = 1; i <= pagination_count; i++) {
    let btn = document.createElement('button')
    btn.innerHTML = i
    btn.className = i === current_page ? "bg-blue-600 text-xl text-white w-8 h-8" : "bg-blue-600 text-xl text-white w-8 h-8 bg-opacity-40"
    pagination_box.appendChild(btn)
    btn.addEventListener('click', () => {
      current_page = i
      displayWindow()
    })
    setStoragePage()
  }
}

function deleteUser(index) {
  let new_users = page.filter(item => {
    if (item.first_name.toLowerCase().includes(searchValue)) {
      return item
    }
  })
  userDate = userDate.filter(item => {
    if (item.id !== new_users[index].id) {
      return item
    }
  })
  if (new_users.length < 2) {
    current_page = 1
  }
  displayWindow()
  setStorage()
}

function editeUser(index) {
  toggleMadal("flex")
  let new_users = page.filter(item => {
    if (item.first_name.toLowerCase().includes(searchValue)) {
      return item
    }
  })
  input_form.querySelector(`[name="first_name"]`).value = new_users[index].first_name
  input_form.querySelector(`[name="last_name"]`).value = new_users[index].last_name
  input_form.querySelector(`[name="phone_number"]`).value = new_users[index].phone_number
  input_form.querySelector(`[name="age"]`).value = new_users[index].age
  input_form.querySelector(`[name="email"]`).value = new_users[index].email
  addOrEdite = index
}

serach_input.addEventListener('input', (e) => {
  searchValue = e.target.value.toLowerCase()
  setStorage()
  displayWindow()
})

function setStoragePage() {
  localStorage.setItem("page", JSON.stringify({ page: current_page, select: custem_per_page }))
}