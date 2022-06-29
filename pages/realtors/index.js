import React from 'react';
import { useAppContext } from '/components/Context';
import { Tree } from 'react-tree-graph';
import 'react-tree-graph/dist/style.css';

export default function Realtors(props) {
  const appContext = useAppContext();

  const tiers = {
    1: 0.035,
    2: 0.04,
    3: 0.025,
    4: 0.015,
    5: 0.01,
    6: 0.025,
    7: 0.05
  }

  let data = {
    name: '0',
    value: 0,
    children: [
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      }, 
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      },  
      {
        name: '0',
        value: 0
      }, 
      {
        name: '0',
        value: 0
      }, 
      {
        name: '0',
        value: 2000,
        children: [
          {
            name: '0',
            value: 0
          },
          {
            name: '0',
            value: 0
          },
          {
            name: '0',
            value: 0
          },
          {
            name: '0',
            value: 0
          },
          {
            name: '0',
            value: 0
          },
          {
            name: '0',
            value: 0
          },
          {
            name: '0',
            value: 0
          },
          {
            name: '0',
            value: 0
          },
          {
            name: '0',
            value: 0
          },
          {
            name: '0',
            value: 0
          },
          {
            name: '0',
            value: 0
          },
          {
            name: '0',
            value: 0
          },
          {
            name: '0',
            value: 0
          },
          {
            name: '0',
            value: 0
          },
          {
            name: '0',
            value: 0
          },
          {
            name: '0',
            value: 0
          },
          {
            name: '0',
            value: 0
          },
          {
            name: '0',
            value: 0
          },
          {
            name: '0',
            value: 3000,
            children: [
              {
                name: '0',
                value: 4000,
                children: [
                  {
                    name: '0',
                    value: 0
                  },
                  {
                    name: '0',
                    value: 0
                  },
                  {
                    name: '0',
                    value: 0
                  },
                  {
                    name: '0',
                    value: 0
                  },
                  {
                    name: '0',
                    value: 0
                  },
                  {
                    name: '0',
                    value: 0
                  },
                  {
                    name: '0',
                    value: 0
                  },
                  {
                    name: '0',
                    value: 0
                  },
                  {
                    name: '0',
                    value: 0
                  },
                  {
                    name: '0',
                    value: 5000,
                    children: [
                      {
                        name: '0',
                        value: 0
                      },
                      {
                        name: '0',
                        value: 0
                      },
                      {
                        name: '0',
                        value: 0,
                        children: [
                          {
                            name: '0',
                            value: 0
                          },
                          {
                            name: '0',
                            value: 0
                          },
                          {
                            name: '0',
                            value: 6000,
                            children: [
                              {
                                name: '0',
                                value: 0
                              },
                              {
                                name: '0',
                                value: 0
                              },
                              {
                                name: '0',
                                value: 7000
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
  
  const [realtors, setRealtors] = React.useState(data);
  const [loading, setLoading] = React.useState(true);
  const [commission, setCommission] = React.useState(0);

  React.useEffect(() => {
    setLoading(false);
    if(loading){
      
      const tiers = {
        1: 0.035,
        2: 0.04,
        3: 0.025,
        4: 0.015,
        5: 0.01,
        6: 0.025,
        7: 0.05
      }
      
      const getTier = (data) => {
        if(data.children){
          if(data.children.length<5)
          {
            data.name = data.value + '(tier 1)';
            data.tier = 1;
          }
          else if(data.children.length<10)
          {
            data.name = data.value + '(tier 2)';
            data.tier = 2;
          }
          else if(data.children.length<15)
          {
            data.name = data.value + '(tier 3)';
            data.tier = 3;
          }
          else if(data.children.length<20)
          {
            data.name = data.value + '(tier 4)';
            data.tier = 4;
          }
          else if(data.children.length<25)
          {
            data.name = data.value + '(tier 5)';
            data.tier = 5;
          }
          else if(data.children.length<40)
          {
            data.name = data.value + '(tier 6)';
            data.tier = 6;
          }
          else
          {
            data.name = data.value + '(tier 7)';
            data.tier = 7;
          }
      
          for(let i=0;i<data.children.length;i++){
            getTier(data.children[i]);
          }
        }
        else{
          data.name = data.value + '(tier 1)';
          data.tier = 1;
        }
      }

      const getCommission = (data, index, tier) => {
        let commission = 0;
        if(data.children && index<tier-1){
          for(let i=0;i<data.children.length;i++){
            let child = data.children[i];
            if(child.value>0){
              commission = commission + child.value * tiers[(index+1)];
              console.log(child.value);
              console.log(tiers[(index+1)]);
            }
            commission = commission + getCommission(child,index+1,tier);
          }
        }
        return commission;
      }
      
      getTier(realtors);
      setRealtors({...realtors});
      console.log("......Calculating Commission......");
      let c = getCommission(realtors,0,realtors.tier);
      setCommission(c);
    }
  }, [loading, realtors]);


  const getTier = (data) => {
    if(data.children){
      if(data.children.length<5)
      {
        data.name = data.value + '(tier 1)';
        data.tier = 1;
      }
      else if(data.children.length<10)
      {
        data.name = data.value + '(tier 2)';
        data.tier = 2;
      }
      else if(data.children.length<15)
      {
        data.name = data.value + '(tier 3)';
        data.tier = 3;
      }
      else if(data.children.length<20)
      {
        data.name = data.value + '(tier 4)';
        data.tier = 4;
      }
      else if(data.children.length<25)
      {
        data.name = data.value + '(tier 5)';
        data.tier = 5;
      }
      else if(data.children.length<40)
      {
        data.name = data.value + '(tier 6)';
        data.tier = 6;
      }
      else
      {
        data.name = data.value + '(tier 7)';
        data.tier = 7;
      }
  
      for(let i=0;i<data.children.length;i++){
        getTier(data.children[i]);
      }
    }
    else{
      data.name = data.value + '(tier 1)';
      data.tier = 1;
    }
  }

  const getCommission = (data, index, tier) => {
    let commission = 0;
    if(data.children && index<tier-1){
      for(let i=0;i<data.children.length;i++){
        let child = data.children[i];
        if(child.value>0){
          commission = commission + child.value * tiers[(index+1)];
          console.log(child.value);
          console.log(tiers[(index+1)]);
        }
        commission = commission + getCommission(child,index+1,tier);
      }
    }
    return commission;
  }


  return (
    <div {...props}>
      <div className={appContext.styles.titleContainer}>{commission}</div>
      <div className={appContext.styles.tableContainer}>
        <textarea value={JSON.stringify(realtors)} style={{width:1800,height:200}} onChange={(e)=>{
          try{
            let j = JSON.parse(e.target.value);
            getTier(j);
            console.log("......Calculating Commission......");
            let c = getCommission(j,0,j.tier);
            setCommission(c);
            setRealtors(j);
          }
          catch(ex){}
        }}/>
        {realtors && (!loading) &&
          <Tree
            key={JSON.stringify(realtors).length}
            data={realtors}
            height={2000}
            width={1800}/>

        }
      </div>
    </div>
  );
};
