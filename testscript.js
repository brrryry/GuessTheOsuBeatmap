async function funny() {
    const todoIdList = [...Array(999).keys()].map(i => i + 1);

    for(const id of todoIdList) {
        console.log(id);
        const response = await fetch(`http://localhost:3001/beatmaps/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `id=${id}`
        });
        const todo = await response.json().then(res => console.log(res));
        await new Promise(r => setTimeout(r, 2000));
    }
    
}



funny();