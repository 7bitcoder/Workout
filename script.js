document.addEventListener('DOMContentLoaded', () => {
    const workoutContainer = document.getElementById('workout-container');

    // Fetching data from workout.json
    fetch('workout.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const workoutPlan = data.workout_plan;
            let htmlContent = '';
            let navigationButtonsHTML = '';
            for (const day in workoutPlan) {
                if (workoutPlan[day] && Array.isArray(workoutPlan[day])) {
                    const dayCode = day.at(-1);

                    // Start of a new Day Section
                    htmlContent += `
                        <section class="day-section" id="${day}">
                            <h2 class="day-title">🏋️‍♂️ Dzień ${dayCode}</h2>
                            <div class="exercise-list">`;

                    workoutPlan[day].forEach((exercise, idx) => {
                        let videoHTML = '';
                        // Check for a video URL, assuming the key is 'video_url' and it points to an mp4 file
                        if (exercise.video_url && exercise.video_url.includes('.mp4')) {
                            videoHTML = `
                                <div class="video-player">
                                    <video autoplay loop muted playsinline src="${exercise.video_url}">
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            `;
                        }

                        const linksHtml = exercise.info_url ? `<a  class="info-link" href="${exercise.info_url}" target="_blank">Szczegóły</a>` : ''

                        // Create the HTML structure for one exercise card
                        const exerciseCardHTML = `
                            <div class="exercise-card">
                                <h3 class="exercise-name">${idx + 1}. ${exercise.exercise}</h3>
                                <span class="muscles">Mięśnie: ${exercise.muscles.join(', ')}</span>
                                
                                ${videoHTML} <!-- Video injected here -->

                                <span class="sets-reps">Serie: ${exercise.sets_reps}</span>

                                <p class="description">${exercise.description}</p>

                                ${linksHtml} <!-- Links injected here -->

                            </div>
                        `;
                        htmlContent += exerciseCardHTML;
                    });

                    // Closing the Day Section and Exercise List
                    htmlContent += `
                            </div>
                        </section>
                    `;

                    navigationButtonsHTML += `<a href="#${day}" class="nav-button">${dayCode}</a>`;
                }
            }

            htmlContent += '<div class="nav-buttons">';
            htmlContent += navigationButtonsHTML;
            htmlContent += '</div>';
            // Inject all generated HTML into the main container
            workoutContainer.innerHTML = htmlContent;
        })
        .catch(error => {
            console.error("Błąd ładowania planu treningowego:", error);
            workoutContainer.innerHTML = `<div style="color: red; padding: 20px;">Nie udało się załadować danych treningowych. Sprawdź konsolę i upewnij się, że plik workout.json jest dostępny.</div>`;
        });
});