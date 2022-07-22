




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