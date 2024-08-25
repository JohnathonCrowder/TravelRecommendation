document.addEventListener('DOMContentLoaded', function() {
    let travelData = [];

    // Function to fetch travel recommendations
    function fetchTravelRecommendations() {
        fetch('travel_recommendation_api.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Travel Recommendations:', data);
                travelData = data;
            })
            .catch(error => {
                console.error('There was a problem fetching the travel recommendations:', error);
            });
    }

    // Function to display filtered recommendations
    function displayRecommendations(recommendations) {
        const resultsContainer = document.getElementById('results');
        if (!resultsContainer) {
            console.error('Results container not found');
            return;
        }

        resultsContainer.innerHTML = ''; // Clear previous results

        if (recommendations.length === 0) {
            resultsContainer.innerHTML = '<p>No results found. Try searching for "beach", "temple", or a country name.</p>';
            return;
        }

        recommendations.forEach(place => {
            const placeElement = document.createElement('div');
            placeElement.classList.add('place');
            placeElement.innerHTML = `
                <h2>${place.name}</h2>
                <img src="${place.image}" alt="${place.name}" style="max-width: 100%; height: auto;">
                <p>${place.description}</p>
                <p>Country: ${place.country}</p>
            `;
            resultsContainer.appendChild(placeElement);
        });
    }

    // Function to filter recommendations based on search keyword
    function filterRecommendations(keyword) {
        keyword = keyword.toLowerCase().trim();
        
        let filteredResults = [];

        if (keyword === 'beach' || keyword === 'temple') {
            filteredResults = travelData.filter(place => 
                place.type.toLowerCase() === keyword
            );
        } else {
            // Assume it's a country search
            filteredResults = travelData.filter(place => 
                place.country.toLowerCase().includes(keyword)
            );
        }

        // Limit to at least 2 recommendations, but show more if available
        return filteredResults.slice(0, Math.max(2, filteredResults.length));
    }

    // Function to clear results
    function clearResults() {
        const resultsContainer = document.getElementById('results');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }
        
        // Clear the search input
        const searchInput = document.querySelector('input[name="search"]');
        if (searchInput) {
            searchInput.value = '';
        }
    }

    // Fetch data when the page loads
    fetchTravelRecommendations();

    // Add event listener to the search form
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = document.querySelector('input[name="search"]');
            if (searchInput) {
                const keyword = searchInput.value;
                const filteredResults = filterRecommendations(keyword);
                displayRecommendations(filteredResults);
            }
        });
    }

    // Add event listener to the clear button
    const clearButton = document.querySelector('button[type="reset"]');
    if (clearButton) {
        clearButton.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent form reset
            clearResults();
        });
    }
});