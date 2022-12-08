






alertHandler = null
function setAlertsHandler(handler)
{
    alertHandler = handler
}

function publichAlert(message, type)
{
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

function setDisplayMappings(state)
{

    noteHandler.displayMappings(state)
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