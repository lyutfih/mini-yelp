const restaurantsDiv = document.getElementById('restaurants')
const restaurantsUrl = 'https://crossover-api.vercel.app/api/restaurants/'
const searchInput = document.getElementById('search')

const restaurants = []

const getRestaurants = async () => {
    const data = await fetch(restaurantsUrl)
    .then(response => response.json())
    .catch(error => console.log(error));
    restaurants.push(...data)
}

const loadRestaurants = async () => {
    await getRestaurants()
    restaurantsDiv.innerHTML = ''
    for(restaurant of restaurants){
        restaurantsDiv.innerHTML += createCard(restaurant)
    }
    detailListeners()
}

const createCard = (value) => {
    return `<div class="col-md-4 mb-3">
    <div class="card p-2">
    <img src="${value.image_URL}" class="card-img-top rounded" alt="Restaurant Image" style="height: 18rem;">
    <div class="card-body p-1">
        <h5 class="card-title mt-2">${value.name}</h5>
        <div class="d-flex justify-content-between mb-3">
        <p class="mb-0">${value.tags.map(tag => setBadge(tag)).join(' ')}</p>
            <div class="rating">
                ${setStars(value.rating)} ${value.rating}
            </div>
        </div>
        <button id="btn${value._id}" class="btn btn-primary more-button btn-block" data-id="${value._id}">Read More</button>
    </div>
    <div class="card-footer text-muted d-flex justify-content-between bg-transparent border-top-0 p-1 mt-2" style="font-size: 0.8rem;">
    <div class="views">Oct 20, 12:45PM
    </div>
    <div class="stats">
         <i class="far fa-eye"></i> 1347
      <i class="far fa-comment"></i> 2
    </div>
  </div>
</div>
</div>`

        
}

const searchRestaurant = (value) => {
    value = value.toLowerCase()
    restaurantsDiv.innerHTML = ''
    for(restaurant of restaurants){
        if(restaurant.name.toLowerCase().includes(value)){
            restaurantsDiv.innerHTML += createCard(restaurant)
         }
     }
     if(restaurantsDiv.innerHTML.trim() === '') {
        restaurantsDiv.innerHTML = `<div class="alert alert-danger" role="alert">
        No restaurants found
      </div>`
     }
     detailListeners()
}

const setBadge = (value) => {
    return `<span class="badge badge-secondary">${value}</span>`
}

const setReview = (user,text,rating) => {
    return `<div class="row mt-2 p-3">
    <div class="col-sm-2">
    <img src="https://static.vecteezy.com/system/resources/thumbnails/004/511/281/small/default-avatar-photo-placeholder-profile-picture-vector.jpg" class="rounded" style="height:5rem">
    <div class="review-block-name"><a href="#">${user}</a></div>
</div>
<div class="col-sm-10">
    <div class="rating">
        ${setStars(rating)} <b>${rating}</b>
    </div>
    <div class="review-block-description">${text}</div>
</div>
</div>`
}

const setStars = (value) => {
    const maxStars = 5;
    const filledStars = Math.round(value * maxStars / 5);
    let starHTML = '';

    for (let i = 0; i < maxStars; i++) {
        if (i < filledStars) {
            starHTML += '<i class="fas fa-star text-warning"></i>'; // Assuming you have font awesome for star icons
        } else {
            starHTML += '<i class="far fa-star text-warning"></i>';
        }
    }
    return starHTML
}

searchInput.addEventListener('keyup', () => searchRestaurant(searchInput.value))


const createModal = (value) => {
    modalDiv = document.getElementById('modal');

    if(!modalDiv){
        modalDiv = document.createElement('div')
        modalDiv.classList.add('modal', 'fade')
        modalDiv.setAttribute('tabindex', -1)
    }

    let found = restaurants.find(res => res._id === value)

    if(!found){
        modalDiv.innerHTML = `<div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-body">
        <div class="alert alert-danger" role="alert">
        No restaurants found
      </div>
      </div>
      </div>
      </div>`

        document.body.append(modalDiv);
        const modal = new bootstrap.Modal(modalDiv);
        modal.show();
    }

    modalDiv.innerHTML = `
      <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-light">
              <h5 class="modal-title">${found.name}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
            </div>
            <div class="modal-body">
             <div class="row">
                <div class="col-md-3">
                <img src="${found.image_URL}" class="rounded" style="height:250px;width:200px">
                    </div>
                <div class="col-md-9">
                    <div class="card-body">
                    <h4 class="card-title">${found.name}</h4>
                    <p class="card-text"><b>Address:</b> ${found.location.address} ${found.location.city},${found.location.state} ${found.location.zip_code}</p>
                    <p class="card-text"><small class="text-muted"><b>Tags:</b> ${found.tags}</small></p>
                    </div>
                </div>
            </div>
            <h3 class="font-weight-bold mt-4">Reviews</h3>
               ${found.reviews.map(review => setReview(review.user_id,review.text,review.rating)).join(' ')}
			</div>
           </div>
        </div>
    `;
  
    document.body.append(modalDiv);
  
    const modal = new bootstrap.Modal(modalDiv);
    modal.show();
  }

const detailListeners = () => {
    let updateBtn = document.querySelectorAll(".more-button")
    updateBtn.forEach((button) => {
      button.addEventListener("click", () => { createModal(button.dataset.id) })
    })
}

window.onload = () => {
    loadRestaurants()
}