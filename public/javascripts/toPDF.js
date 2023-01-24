function printPDF() {
    console.log("generating pdf...");
    const element = document.getElementById("page");
 
    html2pdf()
    .from(element);
}