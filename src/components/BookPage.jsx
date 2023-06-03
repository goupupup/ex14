import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Row, Form, Card } from 'react-bootstrap'
import Book from './Book';

const BookPage = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [is_end, setIs_end] = useState(false);
    const [query, setQuery] = useState('리액트');

    const getData = async() => {
        const url="https://dapi.kakao.com/v3/search/book?target=title";
        const config={
            headers: {"Authorization": "KakaoAK b80880fbde422de3fd9b4a4e67c9bb54"},
            params: {query: query, page:page, size:8}
        }
        setLoading(true);
        const result= await axios.get(url, config);
        console.log(result.data);
        setList(result.data.documents);
        setIs_end(result.data.meta.is_end);
        setLoading(false);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        getData();
    }

    useEffect(()=>{
        getData();
    }, [page]);

    if(loading) return <h1 className='text-center my-5'>로딩중......</h1>
    return (
        <Row>
            <h1 className='text-center my-5'>도서검색</h1>
            <Row>
                <Col md={4}>
                    <Form onSubmit={onSubmit}>
                        <Form.Control  
                            onChange={(e)=>setQuery(e.target.value)}
                            placeholder="검색어" value={query}/>
                    </Form>
                </Col>
            </Row>
            <Row>
                {list.map(book=>
                    <Col key={book.isbn} md={3} xs={6} className="my-2">
                        <Card>
                            <Card.Body>
                                <img src={book.thumbnail}/>
                                <div className='ellipsis'>{book.title}</div>
                                <Book book={book}/>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
                <div className='text-center my-3'>
                    <Button onClick={()=>setPage(page-1) }
                        disabled = {page==1 && true}
                        className="btn-sm">이전</Button>
                    <spna className="px-3">{page}</spna>
                    <Button onClick={()=>setPage(page+1) }
                        disabled = {is_end && true}
                        className="btn-sm">다음</Button>
                </div>
            </Row>
        </Row>
    )
}

export default BookPage