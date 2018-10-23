package com.javaex.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.javaex.vo.std_info_vo;


@Repository
public class UserDao {

	@Autowired
	SqlSession sqlsession;
	
	public List<std_info_vo> getAllList(){
		List<std_info_vo> allList = sqlsession.selectList("user.allList");	
		return allList;
	}

	
	public List<std_info_vo> searchedList(String searchKwd){
		System.out.println(searchKwd.toString());
		List<std_info_vo> searchedList = sqlsession.selectList("user.search", searchKwd);
		System.out.println(searchedList.toString());
		return sqlsession.selectList("user.search", searchKwd);
	}
	
//	public std_info_vo readContent(String content) {
//		return sqlsession.selectOne("user.")
//	}
	
	
}
