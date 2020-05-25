addDialogNode = (skill) => {
    let i = 0;
    for (i = 4; i < 65; i++)
        skill.dialog_nodes.push({
            "type": "standard",
            "title": "Art. " + i,
            "output": {
                "generic": [
                    {
                        "values": [
                            {
                                "text": "Desculpe ainda estou aprendendo sobre a lei"
                            }
                        ],
                        "response_type": "text",
                        "selection_policy": "sequential"
                    }
                ]
            },
            "parent": "node_10_1590102202139",
            "conditions": "@definicao:artigo && @sys-number:" + i,
            "dialog_node": "node_artigo_" + i,
            "previous_sibling": "node_artigo_" + (i - 1)
        })
    return skill
}
exports.module = {
    addDialogNode: addDialogNode
}