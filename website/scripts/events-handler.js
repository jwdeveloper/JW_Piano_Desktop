function parseKeyboardMappings(text)
{
    var lines = text.split('\n');
    var temp_mapping= {};
    for(var i = 0; i < lines.length; i++){
        let line = lines[i]
        if(line.length == 0)
        {
            continue
        }
        var lineSplit = line.split(':');
        let key = lineSplit[0];
        let index = parseInt(lineSplit[1]);
        temp_mapping[key] = index
    }
    return temp_mapping;
}

alertHandler = null
function setAlertsHandler(handler)
{
    alertHandler = handler
}

function publichAlert(message, type)
{
    console.log(alertHandler)

    if(alertHandler == null)
    return
    alertHandler.add(message,type)
}


function refreshKeyboard()
{
    noteHandler.refresh()
}

noteHandler = null
function setNoteHanlder(handler)
{
    noteHandler = handler
}

function publichNodeEvent(packetId, nodeIndex, velocity)
{
    pianoSocket.sendNoteRequest(packetId, nodeIndex, velocity);
    if(packetId != 0)
     return
    noteHandler.handle_note_event(nodeIndex, velocity)
}

function publishRefreshEvent()
{
    console.log('public refresh notes event')
    pianoSocket.sendRefreshRequest()
    noteHandler.refresh();
}