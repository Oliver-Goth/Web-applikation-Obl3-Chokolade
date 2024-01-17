BaseUrl = "https://charlottesstockapi20240117224434.azurewebsites.net"

new Vue({
    el: '#app',
    data: {
        eggs: [],
        filteredEggs: [],
        stockLevel: 0,
        error: '',
        editedEgg: {
            ProductNo: 0,
            ChocolateType: '',
            Price: 0,
            InStock: 0
        }
    },
    mounted() {
        // Hent data ved start
        this.fetchData();
    },
    methods: {
        fetchData() {
            // Axios kald til at hente data fra API
            axios.get(BaseUrl)
                .then(response => {
                    this.eggs = response.data;
                    this.filteredEggs = this.eggs;
                })
                .catch(error => {
                    this.error = 'Fejl ved hentning af data.';
                });
        },
        filterByStockLevel() {
            // Filtrer påskeæg baseret på minimum lagerbeholdning
            this.filteredEggs = this.eggs.filter(egg => egg.InStock < this.stockLevel);
        },
        editEgg(egg) {
            // Åbn redigeringsmodal og gem kopien af ægget for senere opdatering
            this.editedEgg = { ...egg };
            // Eksempel: Åbn Bootstrap Modal
            $('#editModal').modal('show');
        },
        updateEgg() {
            // Opdater påskeæg via API
            axios.put(BaseUrl, this.editedEgg)
                .then(response => {
                    // Opdater lokal liste
                    const index = this.eggs.findIndex(e => e.ProductNo === this.editedEgg.ProductNo);
                    if (index !== -1) {
                        this.eggs.splice(index, 1, this.editedEgg);
                    }
                    // Luk Bootstrap Modal
                    $('#editModal').modal('hide');
                })
                .catch(error => {
                    // Håndter fejl og vis besked til brugeren
                    console.error('Fejl ved opdatering af påskeæg:', error);
                });
        }
    }
});