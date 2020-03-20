/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.admir.demiraj.datacatalogspringboot.resources;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/**
 *
 * @author root
 */
@Entity
@Table(name="Hospitals")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@EntityListeners(AuditingEntityListener.class)
public class Hospitals {

    public Hospitals(String name) {
        this.name = name;
    }

    public Hospitals() {
    }
    
    
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private BigInteger hospital_id;
    
    @NotBlank
    @Column(length = 1024)
    private String name;
  
    @OneToMany(mappedBy="hospital",fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Variables> variables = new ArrayList<>();

    @OnDelete(action = OnDeleteAction.CASCADE)
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
   // @JoinColumn(name = "pathology_id", nullable = true)
    @JsonBackReference
    private Pathology pathology;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigInteger getHospital_id() {
        return hospital_id;
    }

    public void setHospital_id(BigInteger hospital_id) {
        this.hospital_id = hospital_id;
    }

    public List<Variables> getVariables() {
        return variables;
    }

    public void setVariables(List<Variables> variables) {
        this.variables = variables;
    }

    public void setVariablesOneByOne(Variables variable) {
        this.variables.add(variable);
    }


    public Pathology getPathology() {
        return pathology;
    }

    public void setPathology(Pathology pathology) {
        this.pathology = pathology;
    }
}
