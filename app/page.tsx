"use client"

import { useEffect, useState } from "react";


import { dogData } from "./constants/dogData";
import ContentEditor from "./components/contentEditor/contentEdior";
import DOMPurify from "dompurify";

interface Documents {
  id: string;
  title: string;
  content: string;
}

const Home: React.FC<Documents> = () => {

  const [searchData, setSearchData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [titleValue, setTitleValue] = useState('');
  const [contentValue, setContentValue] = useState('');
  const [fullViewId, setFullViewId] = useState('');
  const [editId, setEditId] = useState('');

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(event.target.value);
  };

  const searchWiki = (search: string) => {
    let wiki = JSON.parse(localStorage.getItem('wiki') || '[]');
    const result = wiki.filter((doc: Documents) => doc.title.includes(search));
    setSearchData(result);
  }

  const localWiki = JSON.parse(localStorage.getItem('wiki') || '[]');

  const dataToMap = searchData.length > 0 ? searchData : localWiki;

  const currentArticle = localWiki.find((doc: Documents) => doc.id === fullViewId);

  const reset = () => {
    setTitleValue('');
    setContentValue('');
    setEditId('');
  }

  useEffect(() => {
    if (localWiki.length === 0) {
      localStorage.setItem('wiki', JSON.stringify(dogData));
    }
  },[]);

  return (
    <>
    <header style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
      <h1>Welcome to the Wiki</h1>
    </header>
    <main style={{display: "flex"}}>
        <nav style={{marginRight: "10px", paddingRight: "10px", borderRight: "1px solid grey"}}>
          <input type="text" onChange={(event) => setSearchValue(event.target.value)} placeholder="search" />
          <button onClick={() => searchWiki(searchValue)}>search</button>
          <ul style={{listStyle: "none", marginTop: "20px", marginBottom: "20px", padding: "0"}}>
            {dataToMap.map((doc: Documents) => (
              <li key={doc.id} style={{marginBottom: "5px"}}>
                <strong>{doc.title}</strong>
                <div>
                  <button 
                    onClick={() => {
                      setFullViewId(doc.id);
                      setEditId('');
                    }}>view</button>
                  <button onClick={() => {
                    const newWiki = localWiki.filter((wiki: Documents) => wiki.id !== doc.id);
                    localStorage.setItem('wiki', JSON.stringify(newWiki));
                    setSearchData(newWiki);
                    reset();
                  }}>delete</button>
                  <button onClick={() => {
                      setEditId(doc.id);
                      setTitleValue(doc.title);
                      setContentValue(doc.content);
                    }}>edit</button>
                </div>
                
              </li>
            ))}
          </ul>
          <button onClick={() => {
            setFullViewId('');
            reset();
          }}>Add an Article</button>

        </nav>
        {editId || !currentArticle
        ? <div>
            <h2>Add/edit a wiki article</h2>
            <ContentEditor 
              id={editId}
              titleValue={titleValue} 
              handleChangeTitle={handleChangeTitle} 
              contentValue={contentValue} 
              setContentValue={setContentValue} 
              reset={reset}
            />
          </div> 
        : <div>
            {currentArticle && (
              <div>
                <h2>{currentArticle.title}</h2>
                <div 
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      currentArticle.content),
                  }}
                />
              </div>
            )}
          </div>
        }
      </main> 
    </>
    
  );
};

export default Home;