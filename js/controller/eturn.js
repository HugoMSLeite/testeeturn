'use strict';
    angular.module('TesteEturn')
        .controller('TesteEturnController', function($scope, $localForage, $http) {
            $scope.novoUsuario = {}
            $scope.novoUsuario.telefones = [{numero: ""}]
            $scope.novoUsuario.enderecos = [{
                cep: "",
                numero: null,
                logradouro: "",
                localidade: "",
                uf: "",
                cidade: ""
            }]
            $scope.telefones = []

            $localForage.getItem('contatos').then(contatos => {
                if (contatos) {
                    $scope.contatos = contatos
                    contatos.forEach(contato => {
                        $scope.telefones = $scope.telefones.concat(contato.telefones)
                    })
                } else {
                    $scope.contatos = []
                }
            })

            $scope.addNumero = () => {
                $scope.novoUsuario.telefones.push({numero: ""})
            }

            $scope.rmNumero = (index) => {
                $scope.novoUsuario.telefones.splice(index, 1)
            }

            $scope.rmContato = (index) => {
                $scope.contatos.splice(index, 1)
                $localForage.setItem('contatos', $scope.contatos)
            }

            $scope.addEndereco = () => {
                $scope.novoUsuario.enderecos.push({
                    cep: "",
                    numero: null,
                    logradouro: "",
                    localidade: "",
                    uf: "",
                    cidade: ""
                })
            }

            $scope.validaCep = (index) => {
                if ($scope.novoUsuario.enderecos[index].cep) {
                    $http.get('https://api.postmon.com.br/v1/cep/' + $scope.novoUsuario.enderecos[index].cep).then(returnApi => {
                        $scope.novoUsuario.enderecos[index].logradouro = returnApi.data.logradouro
                        $scope.novoUsuario.enderecos[index].localidade = returnApi.data.bairro
                        $scope.novoUsuario.enderecos[index].uf = returnApi.data.estado
                        $scope.novoUsuario.enderecos[index].cidade = returnApi.data.cidade
                        $scope.novoUsuario.enderecos[index].cepIsValid = true
                    }, err => {
                        alert('CEP não encontrado!')
                    })
                }
            }

            $scope.addContato = () => {
                if (!$scope.novoUsuario.nome) {
                    alert('Informe o nome!')
                } else if (!$scope.novoUsuario.email) {
                    alert('Informe o e-mail!')
                } else if (!$scope.novoUsuario.telefones[0]) {
                    alert('Informe um número de telefone !')
                } else if (!$scope.novoUsuario.enderecos[0].numero) {
                    alert('Informe um endereço')
                } else {
                    var emailCadastrado = false
                    var telefoneCadastrado = false
                    $scope.contatos.forEach(contato => {
                        if (contato.email == $scope.novoUsuario.email) {
                            emailCadastrado = true
                        }
                    })
                    if (emailCadastrado){
                        alert('E-mail já cadastrado!')
                        return
                    }
                    $scope.telefones.forEach(telefone => {
                        $scope.novoUsuario.telefones.forEach(tel => {
                            if (tel.numero == telefone.numero) {
                                telefoneCadastrado = true
                            }
                        })
                    })
                    if (telefoneCadastrado){
                        alert('Telefone já cadastrado!')
                        return
                    }
                    $scope.telefones = $scope.telefones.concat($scope.novoUsuario.telefones)
                    $scope.contatos.push($scope.novoUsuario)
                    $localForage.setItem('contatos', $scope.contatos).then(() => {
                        $scope.novoUsuario = {}
                        $scope.novoUsuario.telefones = [{numero: ""}]
                        $scope.novoUsuario.enderecos = [{
                            cep: "",
                            numero: null,
                            logradouro: "",
                            localidade: "",
                            uf: "",
                            cidade: ""
                        }]
                    })
                }
            }
        })