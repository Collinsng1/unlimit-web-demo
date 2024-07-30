export function convertDate(dateStr: string) {
    // Remove any spaces around the slash
    const cleanedDateStr = dateStr.replace(/\s/g, '');

    // Split the string by the slash
    const dateParts = cleanedDateStr.split('/');

    // Extract the month and year parts
    const month = dateParts[0];
    let year = dateParts[1];

    // Assuming the year part is in the form of "YY"
    // Convert the "YY" to "YYYY"
    if (year.length === 2) {
        year = '20' + year;
    }

    // Return the formatted date string
    return month + '/' + year;
}