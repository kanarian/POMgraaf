import './App.css';
import ForceGraph3D from 'react-force-graph-3d';
import { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import links from './data/links.json';
import nodes from './data/users.json';


function App() {
  const [graphData,setGraphData] = useState({nodes: nodes, links: links})
  const [selectedUser, setSelectedUser] = useState({})
  const [draggable, setDraggable] = useState(false);


  // it should not be needed to initialize this in the useEffect hook, but if I dont do it, it doesnt work
  useEffect(() => {
    setGraphData({nodes: nodes, links: links})
  }, [])


  // when the selected user changes, the camera should pan to that position.
  useEffect( () => {
    if (selectedUser.value !== undefined){
      console.log(selectedUser)
      var selectedUserNode = graphData.nodes.find(x => x.id === selectedUser.value);
      console.log(selectedUserNode)
      const distance = 70;
      const distRatio = 1 + distance/Math.hypot(selectedUserNode.x, selectedUserNode.y, selectedUserNode.z);
      fgRef.current.cameraPosition(
        { x: selectedUserNode.x * distRatio, y: selectedUserNode.y * distRatio, z: selectedUserNode.z * distRatio }, // new position
        selectedUserNode, // lookAt ({ x, y, z })
        3000  // ms transition duration
      );
    }}, [selectedUser])
  

  const dropdownOptions = nodes.map(entry => {return {value: entry.id, label: entry.name[0]}})

  const fgRef = useRef();

  return (
      <div className='App'>
        <div className='header'>
          <div>
          <h1>POM telegram groep interactie graaf</h1>
          <p>Users zijn gelinkt wanneer er minstens een reply interactie tussen hen is geweest. Hoe dikker de lijn, hoe meer interacties.</p>
          </div>
          <div className='header-elt'>
            <p>Draggable?</p>
            <input type="checkbox" onChange={() => setDraggable(!draggable)}/>
          </div>
          <div className='username-finder header-elt'>
            <p><strong>Zoek een user:</strong></p>
            <Select 
              onChange={e=>setSelectedUser(e)}
              options={dropdownOptions}
            />
          </div>     
        </div>

        <ForceGraph3D
        ref = {fgRef}
        graphData = {graphData}
        linkSource='userOne'
        linkTarget='userTwo'
        nodeOpacity={0.9}
        backgroundColor="#4664bd"
        nodeColor = {x => x.id === selectedUser.value ? 'yellow' : '#df7a64'}
        linkColor = {x => 'white'}
        linkWidth = {x => x.value/10}
        enableNodeDrag = {draggable}
        />
      </div>
  );
}

export default App;
