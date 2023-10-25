const giveLinkForm = document.querySelector('.giveLinkForm')
const inp_link = document.getElementById('inp_link')
const apiUrl = 'https://link-saver-wei8.onrender.com/api' //|| 'http://localhost:3000/api'
const btn_submit = document.getElementById('btn_submit')
const btn_delete = document.getElementById('btn_delete')

document.addEventListener("DOMContentLoaded", onPageLoad());
async function onPageLoad(){
    const queryParams = new URLSearchParams(window.location.search)
    if(queryParams.has('pw')){
        const pw = queryParams.get("pw");
        console.log(pw)

        btn_submit.innerText = 'fetching...'
        btn_submit.disabled = true

        const response = await fetch(apiUrl+'/retrieve_all?pw='+pw)
        if(response.ok){
            const entries = await response.json()
            console.log(entries)
            entries.forEach(item => {
                createItem(item)
            })
        } else {
            console.log(await response.text())
        }
        btn_submit.disabled = false
        btn_submit.innerText = 'submit'

    }
}

giveLinkForm.addEventListener('submit', async (e)=>{
    e.preventDefault()
    btn_submit.disabled = true
    if(inp_link.value !== ''){
        try {
            const parsedUrl = new URL(inp_link.value)
            if(parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'){
                const props = await getOg(parsedUrl)
                if(props){
                    console.log('props belowwwwwww')
                    console.log(props)
                    createItem(props)
                }
            } else {
                throw new Error('invalid protocol. http || https')
            }
        } catch (err) {
            console.error('error to parse URL\n' + err)
        }
        btn_submit.disabled = false
    }
})

async function getOg(targetUrl) {
    try {
        console.log('fetching... '+apiUrl+'?targeturl='+targetUrl)
        const response = await fetch(apiUrl+'?targeturl='+targetUrl)
        let websiteMetadata = 
        ogProps = await response.json();
        console.log(ogProps)
        return ogProps
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
    }
}

const itensContainer = document.querySelector('#itensContainer');
itensContainer.addEventListener('click', (e) => {
    e.stopPropagation()
    if(e.target.classList.contains('btn_delete')){
        handleDelete(e.target.id)
    }
    
})
function createItem(p){
    const newItem = document.createElement('div')    
    newItem.className = 'item'
    newItem.id = 'item_id_'+p.id
    const itemTemplate = `
    <button id="${p.id}" class="btn_delete">X</button>
    <div class="content">
        <img class="thumbnail" src="${p.ogMetaTags.image}" alt="thumbnail">
        <div class="details">
            <h1 class="title">${p.ogMetaTags.title}</h1>
            <p class="description">${p.ogMetaTags.description}</p>
            <p class="domain">${p.host}</p>
        </div>
    </div>
    <a href="${p.url}" target="_blank" class="link">${p.url}</a>
`;
    newItem.innerHTML = itemTemplate.trim();
    itensContainer.appendChild(newItem)
}

let deleteModalEnabled = false
function handleDelete(i){
    if(deleteModalEnabled === false){
        deleteModalEnabled = true
        const deleteModal = document.createElement('div')
        deleteModal.className = 'deleteModal'
        deleteModal.innerHTML = `
            <p>Are you sure?</p>
            <button class="modalButton" id="deleteModalConfirm">Delete</button>
            <button class="modalButton" id="deleteModalCancel">Cancel</button>
        `
        document.body.appendChild(deleteModal)
        const deleteModalConfirm = document.getElementById('deleteModalConfirm')
        const deleteModalCancel = document.getElementById('deleteModalCancel')

        deleteModalConfirm.addEventListener('click', async (e) => {
            if(deleteModalEnabled === true){
                deleteModalEnabled = false
                deleteModalConfirm.disabled = true
                deleteModalCancel.disabled = true
                console.log('deleting: '+i)
                
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({id: i}),
                }
                try {
                    const response = await fetch(apiUrl+'/delete', options)
                    const res = await response.json()
                    console.log(res)
                    console.log(i)
                    const itemToRemove = document.getElementById('item_id_'+i)
                    itemToRemove.remove()
                    Modal.remove()
                } catch(e) {
                    console.log(e)
                    deleteModalConfirm.disabled = false
                    deleteModalCancel.disabled = false
                    deleteModalEnabled = true
                }
            }
        })
        deleteModalCancel.addEventListener('click', (e) => {
            if(deleteModalEnabled === true){
                deleteModalEnabled = false
                deleteModal.remove()
            }
        })
    }
}