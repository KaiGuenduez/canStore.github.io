
fetch("products.json")
.then((response) => {
    return response.json();
})
.then((json) => {
    let products = json;
    initialize(products);
})
.catch((err) => {
    console.log(`Fetch Problem: ${err.message}`);
});



function initialize(products) {

    const category = document.querySelector("#category");
    const searchField = document.querySelector("#searchTerm");
    const searchButton = document.querySelector("button");
    const main = document.querySelector("main");

    let lastCategory = category.value;
    let lastSearch = "";

    let categoryGroup;
    let finalGroup;

    finalGroup = products;

    updateDisplay();


    searchButton.addEventListener("click", selectCategory);



    function selectCategory(e) {
       e.preventDefault();

        categoryGroup = [];
        finalGroup = [];

        if(category.value === lastCategory && searchField.value === lastSearch) {
            return;//verlaesst die function ohne weiteres tun
        }
        else {
            lastCategory = category.value;
            lastSearch = searchField.value.trim();

            if(category.value === "All") {
                categoryGroup = products;
                selectProducts();
            }
            else {
                let lowerCaseType = category.value.toLowerCase();

                for (let i = 0 ; i < products.length ; i++) {
                    if (products[i].type === lowerCaseType) {
                        categoryGroup.push(products[i])
                    }
                }
            }
        }

        selectProducts();
    }



    function selectProducts() {

        if (searchField.value === "") {
            finalGroup = categoryGroup;
            updateDisplay();
        }
        else {
            let lowerCaseSearchTerm = searchField.value.trim().toLowerCase();

            for (let i = 0 ; i < categoryGroup.length; i++) {
                if (categoryGroup[i].name.indexOf(lowerCaseSearchTerm) !== -1) {
                    finalGroup.push(categoryGroup[i]);
                }
            }
        }

        updateDisplay();
    }



    function updateDisplay() {

        while (main.firstChild) {
            main.removeChild(main.firstChild);
        }

        if (finalGroup.length === 0) {
            const noResultMessage = document.createElement("p");
            noResultMessage.innerHTML = "No Results to display";
            main.appendChild(noResultMessage);
        
        }else {
            for (let i = 0 ; i < finalGroup.length ; i++) {
                fetchBlob(finalGroup[i]);
            }
        }
    }



    function fetchBlob(product) {
        let url = `images/${product.image}`;

        fetch(url)
        .then((response) => {
            return response.blob();
        })
        .then((blob) => {
            objectURL = URL.createObjectURL(blob);
            showProduct(product, objectURL);
        });
    }



    function showProduct(product, objectURL) {
        
        const section = document.createElement("section");
        const header = document.createElement("h2");
        const price = document.createElement("p");
        const img = document.createElement("img");

        section.setAttribute("class", product.type);
        header.innerHTML = product.name.replace(product.name.charAt(0), product.name.charAt(0).toUpperCase());
        price.innerHTML = `$ ${product.price.toFixed(2)}`;
        img.src = objectURL;
        img.alt = product.name;

        main.appendChild(section);
        section.appendChild(header);
        section.appendChild(price);
        section.appendChild(img);
    }

}