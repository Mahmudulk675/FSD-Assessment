const Products = {
  state: {
    storeUrl: "https://api-demo-store.myshopify.com/api/2020-07/graphql",
    contentType: "application/json",
    accept: "application/json",
    accessToken: "b8385e410d5a37c05eead6c96e30ccb8",
  },

  /**
   * Sets up the query string for the GraphQL request
   * @returns {String} A GraphQL query string
   */
  query: () => `

  {
    products(first:8) { 
      edges {
        node {
          id
          handle
          title
          tags
          description
          onlineStoreUrl
          
          images(first:3) {
            edges {
              node {
                originalSrc
                id
              }
            }
          }
        
          variants(first: 3){
            edges{
              node{
                price
                id
                title
                image {
                  originalSrc
                  id
                }
              }
            }
          }
          
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
    
  `,

  /**
   * Fetches the products via GraphQL then runs the display function
   */
  handleFetch: async () => {
    const productsResponse = await fetch(Products.state.storeUrl, {
      method: "POST",
      headers: {
        // Set up the request headers here
        "Content-Type": Products.state.contentType,
        Accept: Products.state.accept,
        "X-Shopify-Storefront-Access-Token": Products.state.accessToken,
      },
      body: JSON.stringify({
        query: Products.query(),
      }),
    });
    const productsResponseJson = await productsResponse.json();
    Products.displayProducts(productsResponseJson);
  },

  /**
   * Takes a JSON representation of the products and renders cards to the DOM
   * @param {Object} productsJson
   */
  displayProducts: (productsJson) => {
    // Render the products here
    const container = document.getElementById("card-container");
    let products = productsJson.data.products.edges;

    // loop
    products.map((product) => {
      const { node } = product;
      const { tags, images, priceRange, title, description, variants } = node;

      // Card html start
      const cardHtml = ` <div class="card" style="">
        <img src="${
          // images?.edges[0]?.node?.originalSrc
          images?.edges?.map((image) => image.node.originalSrc)
        }" class="card-img-top " width="100%" alt="${node.title}" />
        <div class="card-body">
          <h1 class="card-title">${title}</h1>
          <p class="description">${description.split(" ", 12).join(" ")}...</p>
          
       <div class="card-variants">
       <div class="tags">
       ${tags
         .map((tag) => `<span class="badge bg-primary">${tag}</span>`)
         .join(" ")}
       </div>
       <span class="variants-num">Variant: ${variants.edges.length}</span>
       </div>
        
         <div class="card-bottom">  
         <h5 class="card-price">
          $${priceRange?.minVariantPrice?.amount} ${
        priceRange?.minVariantPrice?.currencyCode
      }</h5>
         <div class="btn-container">
         <button class="btn buy-btn">Buy</button>
         <button class="btn cart-btn">Add to cart</button>
         </div>
       </div>
         </div>
      </div>`;
      container.insertAdjacentHTML("afterbegin", cardHtml);
    });
    console.log(products);
  },

  /**
   * Sets up the click handler for the fetch button
   */
  initialize: () => {
    // Add the click handler here
    const fetchButton = document.querySelector(".fetchButton");
    if (fetchButton) {
      fetchButton.addEventListener("click", Products.handleFetch);
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  Products.initialize();
});
