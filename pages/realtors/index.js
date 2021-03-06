import React from 'react';
import { useAppContext } from '/components/Context';
import Modal from '/components/Modal';

export default function Realtors(props) {
  const appContext = useAppContext();

  let data = {
    name: 'Alex',
    value: 1000,
    children: [
      {
        name: 'Terry',
        value: 0
      }, 
      {
        name: 'Hadi',
        value: 2000,
        children: [
          {
            name: 'Sheng',
            value: 0
          },
          {
            name: 'Tommy',
            value: 3000,
            children: [
              {
                name: 'Ray',
                value: 4000,
                children: [
                  {
                    name: 'Max',
                    value: 0
                  },
                  {
                    name: 'Andy',
                    value: 5000,
                    children: [
                      {
                        name: 'Bruce',
                        value: 0
                      },
                      {
                        name: 'Cat',
                        value: 6000,
                        children: [
                          {
                            name: 'Divid',
                            value: 0
                          },
                          {
                            name: 'Elice',
                            value: 0
                          },
                          {
                            name: 'Frank',
                            value: 7000,
                            children: [
                              {
                                name: 'Gordon',
                                value: 0
                              },
                              {
                                name: 'Helen',
                                value: 0
                              },
                              {
                                name: 'Jay',
                                value: 8000
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
  
  const colors = {
    1: "Green",
    2: "Purple",
    3: "Cyan",
    4: "DarkBlue",
    5: "LightBlue",
    6: "Magenta",
    7: "Red"
  };

  const [realtors, setRealtors] = React.useState(data);
  const [loading, setLoading] = React.useState(true);
  const [id, setId] = React.useState();
  const [selected, setSelected] = React.useState();
  const [selectedContent, setSelectedContent] = React.useState();

  const [tiers, setTiers] = React.useState({
    1: {fixed:0, bonus:0.035},
    2: {fixed:0, bonus:0.038},
    3: {fixed:0, bonus:0.024},
    4: {fixed:0, bonus:0.014},
    5: {fixed:0, bonus:0.009},
    6: {fixed:0, bonus:0.02},
    7: {fixed:0, bonus:0.045}
  });
  

  React.useEffect(() => {
    setLoading(false);
    if(loading){
      
      const getCommission = (data, index, tier) => {
        let commission = 0;
        if(data && data.children && index<7){
          for(let i=0;i<data.children.length;i++){
            let child = data.children[i];
            if(child && child.value>0){
              console.log("----------------------------------");
              console.log(child.name);
              if(tiers[(index+1)].fixed>0){
                commission = commission + child.value * tiers[(index+1)].fixed;
                console.log("Fixed: " + child.value + " * " + tiers[(index+1)].fixed);
              }
              if(index<tier){
                commission = commission + child.value * tiers[(index+1)].bonus;
                console.log("Tier: " + child.value + " * " + tiers[(index+1)].bonus);
              }
            }
            commission = commission + getCommission(child,index+1,tier);
          }
        }
        return commission;
      };

      const getTier = (data) => {
        if(data && data.children){
          if(data.children.length<5)
          {
            data.tier = 1;
            data.id = Math.random();
            data.commission = getCommission(data,0,data.tier);
          }
          else if(data.children.length<10)
          {
            data.tier = 2;
            data.id = Math.random();
            data.commission = getCommission(data,0,data.tier);
          }
          else if(data.children.length<15)
          {
            data.tier = 3;
            data.id = Math.random();
            data.commission = getCommission(data,0,data.tier);
          }
          else if(data.children.length<20)
          {
            data.tier = 4;
            data.id = Math.random();
            data.commission = getCommission(data,0,data.tier);
          }
          else if(data.children.length<25)
          {
            data.tier = 5;
            data.id = Math.random();
            data.commission = getCommission(data,0,data.tier);
          }
          else if(data.children.length<40)
          {
            data.tier = 6;
            data.id = Math.random();
            data.commission = getCommission(data,0,data.tier);
          }
          else
          {
            data.tier = 7;
            data.id = Math.random();
            data.commission = getCommission(data,0,data.tier);
          }
      
          for(let i=0;i<data.children.length;i++){
            getTier(data.children[i]);
            data.commission = getCommission(data,0,data.tier);
          }
        }
        else if(data){
          data.tier = 1;
          data.id = Math.random();
          data.commission = getCommission(data,0,data.tier);
        }
      }
      getTier(realtors);
      setRealtors({...realtors});
    }
  }, [loading, realtors, tiers]);

  
  const createTree = (treeData)=>{
    if(treeData){
      return(
        <ul>
          <li style={{display:"flex"}}>
            <div style={{width:80}}>
              {treeData.name}
            </div> 
            <div style={{width:80}}>
              <button onClick={()=>{
                setSelected(treeData);
              }}>{parseInt(treeData.commission)}</button>
            </div> 
            <div style={{width:80, color:colors[treeData.tier]}}>(Tier {treeData.tier})</div>
            <input defaultValue={treeData.value} style={{width:100}} onBlur={(e)=>{
              let realtors1 = {...realtors};
              setLoading(true);
              realtors1 = updateNode(realtors1, treeData.id, parseInt(e.target.value));
              setRealtors(realtors1);
            }}/>
            <button onClick={()=>{
              let realtors1 = {...realtors};
              realtors1 = deleteNode(realtors1, treeData.id);
              setLoading(true);
              setRealtors(realtors1);
            }}>-</button>
            <button onClick={()=>{
              setId(treeData.id);
            }}>+</button>
          </li>
          {treeData.children && treeData.children.map((child)=>{
            return(<>{createTree(child)}</>);
          })}
        </ul>
      );
    }
  };

  
  const deleteNode = (data, id) => {
    if(data && data.id===id){
      data = undefined;
    }
    else{
      if(data && data.children){    
        for(let i=0;i<data.children.length;i++){
          data.children[i] = deleteNode(data.children[i],id);
        }
      }
    }    
    return data;
  }

  const addNode = (data, id, name) => {
    if(data && data.id===id){
      if(data.children){
        data.children.push(
          {
            name: name,
            value: 0
          }
        );
      }
      else{
        data.children = [
          {
            name: name,
            value: 0
          }
        ];
      }
    }
    else{
      if(data && data.children){    
        for(let i=0;i<data.children.length;i++){
          data.children[i] = addNode(data.children[i],id,name);
        }
      }
    }    
    return data;
  }

  const updateNode = (data, id, value) => {
    if(data && data.id===id){
      data.value = value;
    }
    else{
      if(data && data.children){    
        for(let i=0;i<data.children.length;i++){
          data.children[i] = updateNode(data.children[i],id,value);
        }
      }
    }    
    return data;
  }

  React.useEffect(() => {
    if(selected){      
      const printCommission = (data, index, tier) => {
        let commission = 0;
        let printContent = "";
        if(data && data.children && index<7){
          for(let i=0;i<data.children.length;i++){
            let child = data.children[i];
            if(child && child.value>0){
              printContent = printContent + child.name;
              printContent = printContent + "\n";
              if(tiers[(index+1)].fixed>0){
                commission = commission + child.value * tiers[(index+1)].fixed;
                printContent = printContent + "Fixed: " + child.value + " * " + tiers[(index+1)].fixed;
                printContent = printContent + "\n";
              }
              if(index<tier){
                commission = commission + child.value * tiers[(index+1)].bonus;
                printContent = printContent + "Tier: " + child.value + " * " + tiers[(index+1)].bonus;
                printContent = printContent + "\n";
              }
              printContent = printContent + "---------------";
              printContent = printContent + "\n";
            }
            printContent = printContent + printCommission(child,index+1,tier);
          }
        }
        return printContent;
      };
      let content = printCommission(selected,0,selected.tier);
      setSelectedContent(content);
    }
  }, [selected, tiers]);

  return (
    <div {...props}>
      <div className={appContext.styles.titleContainer}>Commission</div>
      <div className={appContext.styles.tableContainer}>
        {id &&
          <input placeholder='Name' onBlur={(e)=>{
            let realtors1 = {...realtors};
            if(e.target.value.includes(",")){
              let names = e.target.value.split(",");
              for(let i=0;i<names.length;i++){
                realtors1 = addNode(realtors1, id, names[i]);              
              }
            }
            else{
              realtors1 = addNode(realtors1, id, e.target.value);
            }
            setLoading(true);
            setRealtors(realtors1);
            setId(null);
          }}/>
        }
        {!loading &&
          <div style={{display:"flex"}}>
            <div style={{width:1000}}>{createTree(realtors)}</div>
            <div><textarea style={{width:500,height:500}} value={JSON.stringify(tiers)} onChange={(e)=>{
              setLoading(true);
              setTiers(JSON.parse(e.target.value));
            }}/></div>
          </div>        
        }
        {selected &&
          <Modal onClick={()=>{setSelected(null);}}>
            <div>
              {selected.name} = ${selected.commission}<br/> 
              <textarea value={selectedContent} style={{width:500,height:500}}/>
            </div>
          </Modal>
        }
      </div>
    </div>
  );
};
