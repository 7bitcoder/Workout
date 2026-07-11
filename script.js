const WORKOUT_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQmakHSHxZmTzXdQqsSmsDI3LROegOAFBQKMmRVRabnYl2LQ5UhrWBXnjh96B72Jfjl4J5fpmwHVkR2/pub?gid=0&single=true&output=csv';

document.addEventListener('DOMContentLoaded', init);

function init() {
    setLoader();
    Papa.parse(WORKOUT_CSV_URL, {
        download: true,
        header: true,
        transformHeader: (header) => header.trim().toLowerCase(),
        complete: processCSVData,
    });
}

function setLoader(results) {
    const workoutContainer = document.getElementById('workout-container');
    workoutContainer.innerHTML = `<div class="loader">Ładowanie danych treningowych ...</div>`;
}

function processCSVData(results) {
    const workoutContainer = document.getElementById('workout-container');
    workoutContainer.innerHTML = results.errors.length ?
        makeErrorHTML(results.errors) :
        makeWorkoutHTML(prepareWorkoutPlan(results.data));
}

function prepareWorkoutPlan(data) {
    const dayMap = Map.groupBy(data, row => row.day.trim());

    const workoutPlan = { days: [] };
    dayMap.forEach((exercises, name) => { workoutPlan.days.push({ name, exercises }) });
    return workoutPlan;
}

function makeErrorHTML(errors) {
    return `<div style="color: red; padding: 20px;">Nie udało się przetworzyć danych treningowych. errors: ${errors.map(err => err.message).join(', ')}</div>`;
}

function makeWorkoutHTML(workoutPlan) {
    let htmlContent = '';
    let navigationButtonsHTML = '';

    workoutPlan.days.forEach(day => {
        const dayId = `day-${day.name}`;
        htmlContent += makeDayHTML(day, dayId);
        navigationButtonsHTML += `<a href="#${dayId}" class="nav-button">${day.name}</a>`;
    });

    htmlContent += `<div class="nav-buttons">
                        ${navigationButtonsHTML}
                    </div>`;
    return htmlContent;
}

function makeDayHTML(day, dayId) {
    let htmlContent = `<section class="day-section" id="${dayId}">
                            <h2 class="day-title">🏋️‍♂️ Dzień ${day.name}</h2>
                            <div class="exercise-list">`;

    day.exercises.forEach((exercise, idx) => {
        htmlContent += makeExcerciseHTML(exercise, idx);
    });

    htmlContent += `</div>
                </section>`;
    return htmlContent;
}

function makeExcerciseHTML(exercise, idx) {
    const videoHTML = !exercise?.video_url ? '' :
        `<div class="video-player">
            <video autoplay loop muted playsinline src="${exercise.video_url}">
                Your browser does not support the video tag.
            </video>
        </div>`;

    const linksHtml = !exercise?.info_url ? '' :
        `<a  class="info-link" href="${exercise.info_url}" target="_blank">Szczegóły</a>`;

    const htmlContent =
        `<div class="exercise-card">
            <h3 class="exercise-name">${idx + 1}. ${exercise.name}</h3>
            <span class="muscles">Mięśnie: ${exercise.muscles}</span>
            
            ${videoHTML} <!-- Video injected here -->

            <span class="sets-reps">Serie: ${exercise.sets_reps}</span>

            <p class="description">${exercise.description}</p>

            ${linksHtml} <!-- Links injected here -->

        </div>`;

    return htmlContent;
}
