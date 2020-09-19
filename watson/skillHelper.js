
reportDialogToCsv = () => {
    let skill = require('./skill.json');

    let csv = [];
    let i = 0;
    for (i = 0; i < skill.dialog_nodes.length; i++) {
        let conditions = []
        if (skill.dialog_nodes[i].parent)
            conditions.push(skill.dialog_nodes.find(d => d.dialog_node === skill.dialog_nodes[i].parent).conditions)

        conditions.push(skill.dialog_nodes[i].conditions)
        let item = {
            conditions: conditions,
            responses: []
        }

        if (skill.dialog_nodes[i].output && skill.dialog_nodes[i].output.generic)
            skill.dialog_nodes[i].output.generic.forEach(g => {
                item.responses.push(g.values[0].text)
            })

        csv.push(item)
    }
    return csv
}

module.exports = {
    reportDialogToCsv: () => { return reportDialogToCsv(); },
}