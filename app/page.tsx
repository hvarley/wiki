"use client"

import { useState } from "react";

import styles from "./page.module.css";
import ReactQuill from 'react-quill';
import { dogData } from "./constants/dogData";

interface Documents {
  id?: string;
  title: string;
  content: string;
}

export default function Home() {
  // const [wiki, setWiki] = useState<Documents[]>([]);
  const [searchData, setSearchData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [titleValue, setTitleValue] = useState('');
  const [contentValue, setContentValue] = useState('');

  const uid = () => {
    return Date.now().toString(36) + Math.random().toString(36);
  }

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
  
  const setDummyData = (dogData: any) => {
    localStorage.setItem('wiki', JSON.stringify(dogData));
    setSearchData(dogData);
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Welcome to the Wiki</h1>
      <button
        onClick={() => setDummyData(dogData)}
        >Set Dog Data Set</button>
      <input type="text" onChange={(event) => setSearchValue(event.target.value)} placeholder="search" />
      <button onClick={() => searchWiki(searchValue)}>search</button>
      <button onClick={() => setSearchData([])}>reset</button>
      <div>
        <input type="text" value={titleValue} onChange={handleChangeTitle} placeholder="add title" />
        <ReactQuill theme="snow" value={contentValue} onChange={setContentValue} />
        <button onClick={() => { 
          localStorage.setItem('wiki', JSON.stringify([...localWiki, { id: uid(), content: contentValue, title: titleValue }]));
          setTitleValue('');
          setContentValue('');
        }}>add content</button>
      </div>

      
      <ul>
        {dataToMap.map((doc: Documents) => (
  
          <li key={doc.id}>
            <h2>{doc.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: doc.content }} />
            <button onClick={() => {
              const newWiki = localWiki.filter((wiki: Documents) => wiki.id !== doc.id);
              localStorage.setItem('wiki', JSON.stringify(newWiki));
              setSearchData(newWiki);
            }}>delete</button>
          </li>
        ))}
      </ul>

    </main>
  );
}