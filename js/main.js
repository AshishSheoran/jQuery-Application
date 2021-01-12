let saleData = [];      // saleData Array

let page = 1;               // Keep track of current page
let perPage = 10;           // Items we wish to view on each page

$(function() {
    
    loadSaleData();

    $("#sale-table tbody").on("click", "tr", function(e) {
        e.preventDefault();

        let tempData = saleData;
        let i = $(this).closest("tr").index;

        let clickedSale = tempData[i];

        var totalPrice = 0.0;
        clickedSale.items.forEach(element => {
            totalPrice += (element.price * element.quantity);
        });

        var newObjWithTotal = {
            total: totalPrice
        };

        var objWithTotal = _.assign({}, clickedSale, newObjWithTotal);

        let saleModelBodyTemplate = _.template(
            `<h4>Sale: <% temp._id %></h4>
            <h4>Customer</h4>
            <strong>email:</strong><% temp.customer.email %><br>
            <strong>age:</strong><% temp.customer.age %><br>
            <strong>satisfaction:</strong><% temp.customer.satisfaction %> /5
            <br><br>
            <h4>Items: $ <% temp.total.toFixed(2) %></h4>
    
            <table class="table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    <% temp.items.forEach(e => { %>
                        <tr>
                            <td><% e.name %></td>
                            <td><% e.price %></td>
                            <td><% e.quantity %>>/td>
                        </tr>
                    <% }); %>
                </tbody>
            </table>
            `
        );

        let modalInfo = saleModelBodyTemplate({'temp': objWithTotal});
        modal.find('.modal-body').html(modalInfo);
        modal.modal('show');
    });

    $("#previousPage").on("click", function() {
        if(page > 1) {
            page--;
            loadSaleData();
        }
    });

    $("nextPage").on("click", function() {
        page++;
        loadSaleData();
    });

    
});

function loadSaleData() {
    // To update current page number
    $('#currentPage').text(page);

    let api="https://secure-falls-48791.herokuapp.com/api/sales?page=" + page + "&perPage=" + perPage;

    fetch(api)
    .then((response) => response.json())
    .then(json => {
        saleData = json;
        refreshMainTable(saleData);
    });
};

function refreshMainTable(data) {
    $("#sale-table tbody").empty();
    let saleTableTemplate = _.template(
        `<% _.forEach(sales, function(data) { %>
            <tr data-id=<% data._id %> >
                <td><% data.customer.email %></td>
                <td><% data.storeLocation %></td>
                <td><% data.items.length %></td>
                <td><% moment.utc(data.saleDate).local().formal('LLLL') %></td>
            </tr>
        <% }); %>`
    );

    let rView = saleTableTemplate({'sales': data});
    $("#sale-table tbody").html(rView);
};