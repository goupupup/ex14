import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { Row, Col, Table, Form, Button } from 'react-bootstrap'
import MapPage from './MapPage';
import { app } from '../firebaseInit';
import { getDatabase, ref, set } from 'firebase/database';
import moment from 'moment';

const LocalPage = ({history}) => {
    const db = getDatabase(app);
    const uid=sessionStorage.getItem('uid');

    const [locals, setLocals] = useState([]);
    const [query, setQuery] = useState('인하대학교');
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [is_end, setIs_end] = useState(false);

    const getLocal = async () => {
        const url = "https://dapi.kakao.com/v2/local/search/keyword.json";
        const config = {
            headers: { "Authorization": "KakaoAK b80880fbde422de3fd9b4a4e67c9bb54" },
            params: { query: query, page: page, size: 5 }
        }
        const result = await axios.get(url, config);
        console.log(result);
        setLocals(result.data.documents);
        setTotal(result.data.meta.pageable_count);
        setIs_end(result.data.meta.is_end);
    }

    useEffect(() => { //페이지가 렌더링될때 호출
        getLocal();
    }, [page]);

    const onSearch = (e) => {
        e.preventDefault();
        getLocal();
    }

    const onFavorite = (local) => {
        if(uid){
            if(window.confirm(local.place_name + ' 즐겨찾기에 등록하실래요? ')){
                const date = moment(new Date()).format('YYYY-MM-DD-HH:mm:ss');
                set(ref(db, `favorite/${uid}/${local.id}`), {...local, date:date});
                alert('즐겨찾기 등록완료');
            }
        }else {
            sessionStorage.setItem('target','/local')
            history.push('/login');
        }
    }

    return (
        <Row>
            <Row>
                <Col>
                    <h1 className='text-center my-5'>지역검색</h1>
                    <Row className='my-2'>
                        <Col md={3} xs={6}>
                            <Form onSubmit={onSearch}>
                                <Form.Control value={query}
                                    onChange={(e)=>setQuery(e.target.value)}
                                    placeholder='검색어' />
                            </Form>
                        </Col>
                        <Col>
                            검색수: {total}건
                        </Col>
                    </Row>
                    <Table striped bordered hover>
                        <thead>
                            <tr className='text-center'>
                                <td>장소명</td>
                                <td>주소</td>
                                <td>전화</td>
                                <td>위치</td>
                                <td>즐겨찾기</td>
                            </tr>
                        </thead>
                        <tbody>
                            {locals.map(local =>
                                <tr key={local.id}>
                                    <td>{local.place_name}</td>
                                    <td>{local.phone}</td>
                                    <td>{local.address_name}</td>
                                    <td><MapPage local={local}/></td>
                                    <td><Button className='btn-sm'
                                        onClick={()=>onFavorite(local)}>즐겨찾기</Button></td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <div className='text-center my-2'>
                        <Button
                            disabled={page==1} 
                            onClick={()=>setPage(page-1)}>이전</Button>
                        <span className="mx-3">{page}</span>
                        <Button 
                            disabled={is_end}
                            onClick={()=>setPage(page+1)}>다음</Button>
                    </div>
                </Col>
            </Row>
        </Row>
    )
}

export default LocalPage